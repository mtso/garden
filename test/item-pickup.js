const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const config = require('../app/config')
const actions = require('../app/actions/action-type')

// Adapt module syntax so these reducer tests need no legacy Babel/webpack install.
// Floor generation is stubbed; the WALK handler is evaluated unchanged.
const source = fs.readFileSync(
  path.join(__dirname, '../app/reducers/map-reducer.js'), 'utf8'
).replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"]\s*\n/g, '')
  .replace('export default mapReducer;', 'this.reducer = mapReducer;')
const context = Object.assign({}, config, actions, {
  Math: Object.assign(Object.create(Math), { random: () => 0.8 }),
  generateDetailed: () => ({
    mobs: [], objects: [], spawn: { x: 0, y: 0 }, exit: { x: 9, y: 9 },
  }),
  Mob: require('../app/models/mob'),
  createBackground: require('../app/utils/background').createBackground,
})
vm.runInNewContext(source, context)
const reducer = context.reducer

function fixture(type, pickedUp) {
  const item = { type, position: { x: 1, y: 0 } }
  if (pickedUp !== undefined) item.isPickedUp = pickedUp
  const otherItem = { type, position: { x: 2, y: 0 } }
  return {
    player: { health: 10, attack: 1, exp: 0, position: { x: 0, y: 0 } },
    map: {
      '0:0': { type: config.FLOOR },
      '1:0': { type: config.FLOOR },
      '2:0': { type: config.FLOOR },
    },
    objects: [item, otherItem],
    objectMap: { '1:0': item, '2:0': otherItem },
    mobs: [], exit: { x: 9, y: 9 }, isBossFloor: false, isGameOver: false,
  }
}

function walk(state, x) {
  const next = reducer(state, { type: actions.WALK, direction: { x, y: 0 } })
  assert.strictEqual(next.player.position.x, state.player.position.x + x)
  return next
}

function stats(state) {
  return [state.player.health, state.player.attack, state.player.exp]
}

const cases = [
  { type: config.POTION, reward: [3, 0, 5] },
  { type: config.WEAPON, reward: [0, 3, 5] },
  { type: config.TREASURE, reward: [6, 6, 20] },
]
let failures = 0
let passed = 0
function test(name, run) {
  try {
    run()
    passed++
    console.log('PASS ' + name)
  } catch (error) {
    failures++
    console.error('FAIL ' + name + '\n' + error.stack)
  }
}

cases.forEach(({ type, reward }) => {
  const initialFlags = [false, undefined]
  initialFlags.forEach(flag => {
    test(type + ' applies once with initial isPickedUp=' + flag, () => {
      let state = walk(fixture(type, flag), 1)
      const expected = [10 + reward[0], 1 + reward[1], reward[2]]
      assert.deepStrictEqual(stats(state), expected)
      assert.strictEqual(state.objects[0].isPickedUp, true)
      assert.strictEqual(state.objectMap['1:0'].isPickedUp, true)

      for (let revisit = 0; revisit < 2; revisit++) {
        state = walk(state, -1)
        assert.deepStrictEqual(stats(state), expected)
        state = walk(state, 1)
        assert.deepStrictEqual(stats(state), expected)
      }

      state = walk(state, 1)
      assert.deepStrictEqual(stats(state), expected.map((value, i) => value + reward[i]))
      assert.strictEqual(state.objects[1].isPickedUp, true)
      assert.strictEqual(state.objectMap['2:0'].isPickedUp, true)
    })
  })

  test(type + ' ignores an already consumed item', () => {
    const state = walk(fixture(type, true), 1)
    assert.deepStrictEqual(stats(state), [10, 1, 0])
  })

  test(type + ' keeps the object map indexed by coordinates', () => {
    const state = walk(fixture(type), 1)
    assert.deepStrictEqual(Object.keys(state.objectMap).sort(), ['1:0', '2:0'])
  })
})

test('initial floor owns a centered background', () => {
  const initial = reducer(undefined, { type: '@@INIT' })
  assert.strictEqual(initial.background.id, 'stego')
  assert.deepStrictEqual(initial.background.origin, { x: -1, y: 8 })
  assert.strictEqual(initial.background.color, '#403f3c')
})

test('walking and blocked movement preserve the floor background', () => {
  const state = fixture(config.POTION, true)
  state.background = context.createBackground(30, () => 0)
  const snapshot = JSON.stringify(state.background)
  const moved = walk(state, 1)
  assert.strictEqual(moved.background, state.background)
  const blocked = reducer(moved, {
    type: actions.WALK, direction: { x: 0, y: 1 },
  })
  assert.strictEqual(blocked.background, state.background)
  assert.strictEqual(JSON.stringify(blocked.background), snapshot)
})

test('new game resets the boss background to the black theme', () => {
  const state = fixture(config.POTION, true)
  state.background = context.createBackground(30, () => 0)
  state.background.color = '#ccccc4'
  state.isBossFloor = true
  const restarted = reducer(state, { type: actions.NEW_GAME })
  assert.notStrictEqual(restarted.background, state.background)
  assert.strictEqual(restarted.background.id, 'stego')
  assert.strictEqual(restarted.background.color, '#403f3c')
  assert.strictEqual(restarted.isBossFloor, false)
  assert.strictEqual(restarted.floor, 1)
})

;[0, 150].forEach(exp => {
  test('exit generates a background with player exp=' + exp, () => {
    const state = fixture(config.POTION, true)
    state.floor = 1
    state.player.exp = exp
    state.background = context.createBackground(30, () => 0)
    state.exit = { x: 1, y: 0 }
    const advanced = reducer(state, {
      type: actions.WALK, direction: { x: 1, y: 0 },
    })
    assert.strictEqual(advanced.floor, 2)
    assert.strictEqual(advanced.isBossFloor, exp === 150)
    assert.notStrictEqual(advanced.background, state.background)
    assert.strictEqual(advanced.background.id, 'stego')
    assert.strictEqual(advanced.background.color, exp === 150 ? '#ccccc4' : '#403f3c')
    assert.deepStrictEqual(advanced.background.origin, { x: -1, y: 8 })
  })
})

test('combat preserves the floor background and its origin', () => {
  const state = fixture(config.POTION, true)
  state.background = context.createBackground(30, () => 0.4)
  const snapshot = JSON.stringify(state.background)
  const origin = state.background.origin
  state.mobs = [{ position: { x: 1, y: 0 }, health: 10, attack: 1, isAlive: true }]
  const fought = reducer(state, {
    type: actions.WALK, direction: { x: 1, y: 0 },
  })
  assert.strictEqual(fought.mobs[0].health, 9)
  assert.strictEqual(fought.player.position.x, 0)
  assert.strictEqual(fought.background, state.background)
  assert.strictEqual(fought.background.origin, origin)
  assert.strictEqual(JSON.stringify(fought.background), snapshot)
})

console.log(passed + ' passed, ' + failures + ' failed')
if (failures) process.exitCode = 1
