const assert = require('assert')
const { createBackground } = require('../app/utils/background')
const catalog = require('../app/assets/backgrounds.json')
const { char } = require('../app/config')
const { drawView, pad, formatView, composeLayers } = require('../app/utils/character-layout')

let passed = 0
let failures = 0
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

const selections = [
  { id: 'rex', random: 0, upper: 0.199, width: 57, height: 29, origin: { x: 1, y: 0 } },
  { id: 'fossil', random: 0.2, upper: 0.399, width: 69, height: 15, origin: { x: -5, y: 7 } },
  { id: 'baby-dino', random: 0.4, upper: 0.599, width: 55, height: 18, origin: { x: 2, y: 6 } },
  { id: 'raptor', random: 0.6, upper: 0.799, width: 40, height: 28, origin: { x: 9, y: 1 } },
  { id: 'stego', random: 0.8, upper: 0.999, width: 60, height: 14, origin: { x: -1, y: 8 } },
]

selections.forEach(({ id, random, upper, width, height, origin }) => {
  test('selects and centers ' + id + ' with one random draw', () => {
    let draws = 0
    const background = createBackground(30, () => { draws++; return random })
    assert.strictEqual(draws, 1)
    assert.strictEqual(background.id, id)
    assert.strictEqual(createBackground(30, () => upper).id, id)
    assert.deepStrictEqual(background.origin, origin)
    assert.strictEqual(background.color, '#403f3c')
    assert.strictEqual(background.rows.length, height)
    assert.strictEqual(Math.max(...background.rows.map(row => row.length)), width)
  })
})

test('bundles all artwork with native ASCII and Braille spacing', () => {
  assert.deepStrictEqual(catalog.map(art => art.id), ['rex', 'fossil', 'baby-dino', 'raptor', 'stego'])
  assert.strictEqual(catalog[0].rows[0], '                                ____')
  assert(catalog[0].rows.some(row => row.includes("'<`o\\\\")))
  assert.strictEqual(catalog[1].rows[0], '                                   . . . . . . .          .---_--.')
  assert(catalog[1].rows.some(row => row.includes('//! (#) _\\')))
  catalog.slice(2).forEach(art => {
    assert(art.rows[0].startsWith('\u2800'))
    assert(art.rows.some(row => row.includes('⣿')))
  })
})

const art = {
  rows: ['ABCDE', 'FGHIJ', 'KLMNO'],
  origin: { x: 0, y: 0 },
  color: '#82817c',
}
const position = { x: 1, y: 1 }
const empty = [
  [' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' '],
]

test('foreground glyphs cover artwork and keep their inherited color', () => {
  const layout = formatView([
    [' ', '.', ' '], [' ', '¶', ' '], [' ', ' ', ' '],
  ], 3, false)
  const runs = composeLayers(layout, art, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), 'AB.DE\nFG¶IJ\nKLMNO')
  assert.strictEqual(runs.find(run => run.text.includes('A')).color, '#82817c')
  assert.strictEqual(runs.find(run => run.text.includes('.')).color, null)
  assert.strictEqual(runs.find(run => run.text.includes('¶')).color, null)
})

test('camera movement shifts artwork by two columns or one row', () => {
  const layout = formatView(empty, 3, false)
  const cameraArt = Object.assign({}, art, {
    rows: ['ABCDEFG', 'HIJKLMN', 'OPQRSTU', 'VWXYZab'],
  })
  const textAt = pos => composeLayers(layout, cameraArt, pos, 2).map(run => run.text).join('')
  assert.strictEqual(textAt({ x: 1, y: 1 }), 'ABCDE\nHIJKL\nOPQRS')
  assert.strictEqual(textAt({ x: 2, y: 1 }), 'CDEFG\nJKLMN\nQRSTU')
  assert.strictEqual(textAt({ x: 1, y: 2 }), 'HIJKL\nOPQRS\nVWXYZ')
})

test('player covers objects, mobs, and terrain at the same tile', () => {
  const data = {
    map: { '1:1': { type: 'WALL' } },
    objects: [{ type: 'POTION', position, isPickedUp: false }],
    mobs: [{ position, isAlive: true }], exit: { x: 9, y: 9 },
  }
  const grid = drawView(data, position, 2, false)
  assert.strictEqual(grid[1][1], char.PLAYER)
  const runs = composeLayers(formatView(grid, 3, false), art, position, 2)
  assert.strictEqual(runs.map(run => run.text).join('').split('\n')[1], 'FG¶IJ')
  assert.strictEqual(runs.find(run => run.text.includes('¶')).color, null)
})

;[
  { name: 'object over mob', type: 'FLOOR', pickedUp: false, alive: true, glyph: '♥' },
  { name: 'living mob', type: 'FLOOR', pickedUp: true, alive: true, glyph: '#' },
  { name: 'consumed item and dead mob', type: 'FLOOR', pickedUp: true, alive: false, glyph: '.' },
  { name: 'wall', type: 'WALL', glyph: 'I' },
  { name: 'floor', type: 'FLOOR', glyph: '.' },
].forEach(({ name, type, pickedUp, alive, glyph }) => {
  test(name + ' retains foreground precedence and color', () => {
    const data = {
      map: { '1:0': { type } },
      objects: pickedUp === undefined ? [] : [
        { type: 'POTION', position: { x: 1, y: 0 }, isPickedUp: pickedUp },
      ],
      mobs: alive === undefined ? [] : [{ position: { x: 1, y: 0 }, isAlive: alive }],
      exit: { x: 9, y: 9 },
    }
    const grid = drawView(data, position, 2, false)
    assert.strictEqual(grid[0][1], glyph)
    const runs = composeLayers(formatView(grid, 3, false), art, position, 2)
    assert.strictEqual(runs.map(run => run.text).join('').split('\n')[0], 'AB' + glyph + 'DE')
    assert.strictEqual(runs.find(run => run.text.includes(glyph)).color, null)
  })
})

;[
  { boss: false, glyph: '♦' },
  { boss: true, glyph: '&' },
].forEach(({ boss, glyph }) => {
  test('drawView retains the exit glyph for boss=' + boss, () => {
    const grid = drawView({
      map: { '1:0': { type: 'FLOOR' } }, objects: [], mobs: [], exit: { x: 1, y: 0 },
    }, position, 2, boss)
    assert.strictEqual(grid[0][1], glyph)
  })
})

test('portal, boss, and player-on-exit decorations cover artwork', () => {
  const layout = formatView([
    [' ', '♦', ' '], [' ', '&', ' '], [' ', '¶', ' '],
  ], 3, true)
  assert.strictEqual(layout.text, ' (♦) \n \\&/ \n (¶) ')
  const runs = composeLayers(layout, art, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), 'A(♦)E\nF\\&/J\nK(¶)O')
  const foreground = runs.filter(run => run.color === null).map(run => run.text).join('')
  assert.strictEqual(foreground, '(♦)\n\\&/\n(¶)')
})

test('left-edge portal decoration preserves its extension into padding', () => {
  const layout = formatView([
    ['♦', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' '],
  ], 11, false)
  assert.strictEqual(layout.left, 2)
  assert.strictEqual(layout.top, 2)
  assert.strictEqual(layout.text, '\n\n (♦)   \n       \n       \n\n')
  const background = Object.assign({}, art, { rows: ['XXXXX', 'XXXXX', 'XXXXX'] })
  const runs = composeLayers(layout, background, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), '\n\n (♦)XXX\n  XXXXX\n  XXXXX\n\n')
  assert(runs.some(run => run.color === null && run.text.includes('(♦)')))
})

test('right-edge portal preserves the existing unwrapped edge glyph', () => {
  const layout = formatView([
    [' ', ' ', '♦'], [' ', ' ', ' '], [' ', ' ', ' '],
  ], 3, false)
  assert.strictEqual(layout.text, '    ♦\n     \n     ')
  const runs = composeLayers(layout, art, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), 'ABCD♦\nFGHIJ\nKLMNO')
  assert.strictEqual(runs.find(run => run.text.includes('♦')).color, null)
})

test('per-background color applies only to artwork', () => {
  const layout = formatView([
    [' ', '.', ' '], [' ', '¶', ' '], [' ', ' ', ' '],
  ], 3, false)
  const runs = composeLayers(layout, Object.assign({}, art, { color: '#123456' }), position, 2)
  assert.strictEqual(runs.find(run => run.text.includes('A')).color, '#123456')
  assert.strictEqual(runs.find(run => run.text.includes('.')).color, null)
  assert.strictEqual(runs.find(run => run.text.includes('¶')).color, null)
})

test('missing background preserves every foreground padding and newline', () => {
  const layout = formatView([
    ['♦', ' ', ' '], [' ', '&', ' '], [' ', '¶', ' '],
  ], 12, true)
  assert.strictEqual(composeLayers(layout, null, position, 2).map(run => run.text).join(''), layout.text)
  assert.strictEqual(composeLayers(layout, undefined, position, 2).map(run => run.text).join(''), layout.text)
  assert.strictEqual(pad('', 2.5, ' '), '   ')
})

test('negative origins, ragged rows, and spaces keep native artwork columns', () => {
  const background = Object.assign({}, art, {
    rows: ['unused', ' A B', 'Z', ' C'], origin: { x: -1, y: -1 },
  })
  const layout = formatView(empty, 3, false)
  const runs = composeLayers(layout, background, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), 'A B  \n     \nC    ')
  const beyond = composeLayers(layout, background, { x: 20, y: 20 }, 2)
  assert.strictEqual(beyond.map(run => run.text).join(''), layout.text)
})

test('Braille marks retain native columns and blank Braille cells are transparent', () => {
  const background = Object.assign({}, art, { rows: ['⣿⠀⣀ ⣷', 'A⠀ B⠀', '⠀⠀⠀⠀⠀'] })
  const runs = composeLayers(formatView(empty, 3, false), background, position, 2)
  assert.strictEqual(runs.map(run => run.text).join(''), '⣿ ⣀ ⣷\nA  B \n     ')
  assert.strictEqual(runs.find(run => run.text.includes('⣿')).color, '#82817c')
})

test('large artwork clips to the viewport and circular FOV with rounded padding', () => {
  const grid = Array.from({ length: 15 }, () => Array(15).fill(' '))
  const layout = formatView(grid, 41, false)
  const background = Object.assign({}, art, {
    rows: Array(40).fill('Z'.repeat(60)), origin: { x: -5, y: -5 },
  })
  assert.strictEqual(layout.left, 7)
  assert.strictEqual(layout.top, 7)
  const runs = composeLayers(layout, background, { x: 7, y: 7 }, 8)
  const lines = runs.map(run => run.text).join('').split('\n')
  assert.deepStrictEqual(lines.slice(0, 7), Array(7).fill(''))
  const visibleRows = [
    '       ' + 'Z'.repeat(15) + '       ',
    '    ' + 'Z'.repeat(21) + '    ',
    '  ' + 'Z'.repeat(25) + '  ',
    ' ' + 'Z'.repeat(27) + ' ',
    ...Array(7).fill('Z'.repeat(29)),
    ' ' + 'Z'.repeat(27) + ' ',
    '  ' + 'Z'.repeat(25) + '  ',
    '    ' + 'Z'.repeat(21) + '    ',
    '       ' + 'Z'.repeat(15) + '       ',
  ]
  assert.deepStrictEqual(lines.slice(7, 22), visibleRows.map(row => '       ' + row))
  assert.deepStrictEqual(lines.slice(22), Array(7).fill(''))
})

test('artwork stays inside circular map visibility including half-tile columns', () => {
  const pos = { x: 7, y: 7 }
  const grid = drawView({
    map: { '0:0': { type: 'FLOOR' } }, objects: [], mobs: [], exit: { x: 99, y: 99 },
  }, pos, 8, false)
  assert.strictEqual(grid[0][0], ' ')
  const background = Object.assign({}, art, { rows: Array(15).fill('X'.repeat(29)) })
  const runs = composeLayers(formatView(grid, 15, false), background, pos, 8)
  const top = runs.map(run => run.text).join('').split('\n')[0]
  assert.strictEqual(top[0], ' ')
  assert.strictEqual(top[6], ' ')
  assert.strictEqual(top[7], 'X')
  assert.strictEqual(top[21], 'X')
  assert.strictEqual(top[22], ' ')
  assert.strictEqual(grid[0][0], ' ')
})

test('artwork exactly on the circular FOV boundary remains hidden', () => {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(' '))
  const background = Object.assign({}, art, { rows: Array(9).fill('ABCDEFGHIJKLMNOPQ') })
  const runs = composeLayers(formatView(grid, 9, false), background, { x: 4, y: 4 }, 5)
  const lines = runs.map(run => run.text).join('').split('\n')
  assert.strictEqual(lines[0], '   DEFGHIJKLMN   ')
  assert.strictEqual(lines[4], 'ABCDEFGHIJKLMNOPQ')
  assert.strictEqual(lines[8], '   DEFGHIJKLMN   ')
  assert.strictEqual(lines[0][2], ' ')
  assert.strictEqual(lines[0][3], 'D')
  assert.strictEqual(lines[0][13], 'N')
  assert.strictEqual(lines[0][14], ' ')
})

test('repeated rendering leaves the background, origin, and rows unchanged', () => {
  const background = createBackground(30, () => 0.4)
  const snapshot = JSON.stringify(background)
  Object.freeze(background.origin)
  Object.freeze(background.rows)
  Object.freeze(background)
  const layout = formatView(empty, 3, false)
  const first = composeLayers(layout, background, { x: 15, y: 10 }, 2)
  assert.deepStrictEqual(composeLayers(layout, background, { x: 15, y: 10 }, 2), first)
  assert.strictEqual(JSON.stringify(background), snapshot)
  assert.strictEqual(createBackground(30, () => 0.4).rows, background.rows)
})

console.log(passed + ' passed, ' + failures + ' failed')
if (failures) process.exitCode = 1
