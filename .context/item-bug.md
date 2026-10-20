# Consumed items apply their effects again

The diagnosis below describes the original behavior before the fix. See the
implementation status at the end for the applied changes and regression tests.

## Root cause

The `WALK` handler in `app/reducers/map-reducer.js:90-109` looks up the
destination item in `state.objectMap[nextKey]` and applies its effects whenever
`if (item)` is truthy. It never checks whether `item.isPickedUp` is already true.

The first pickup sets `isPickedUp = true`, but leaves the item in both
`objects` and `objectMap` (`app/reducers/map-reducer.js:113-125`). Returning to
that coordinate therefore finds the same item and runs the effect switch again.
This affects potions, weapons, and treasure, including their experience rewards.
Potion health changes are random, ranging from -1 to +3 per activation; repeated
experience gains reliably reveal the bug even when a health roll is zero.

The item disappears visually because `GameView` independently builds an index
from `data.objects` and only draws items whose `isPickedUp` flag is false
(`app/components/GameView.jsx:58-61,83-85`). Mob movement also checks the flag
(`app/reducers/map-reducer.js:204-207`). The player pickup path omits the same
eligibility check, so a hidden item remains mechanically active.

### Related map update defect

The assignment at `app/reducers/map-reducer.js:114-118` uses `{ nextKey: item }`.
That creates a property literally named `"nextKey"`, rather than updating the
coordinate property such as `"1:0"`. It should use `{ [nextKey]: item }`.

This is a separate defect, not the cause of repeat effects: floor generation
stores the same object reference in `objects` and `objectMap`
(`app/reducers/map-reducer.js:28-32`), and `item.isPickedUp = true` mutates that
object in place. The coordinate entry already has the true flag after pickup;
the effect handler simply ignores it. Correcting only the property name does
not prevent repeat effects.

## Reproduction and evidence

A dependency-free Node harness evaluated the current reducer source with only
its import/export syntax adapted. It stubbed floor generation, supplied a
two-tile floor with one item and no mobs, and fixed `Math.random()` at `0.8`.
It dispatched east onto the item, west off it, and east onto it again. Each
scenario started with health 10, attack 1, and experience 0.

| Item | After first pickup: HP / attack / XP | After revisit: HP / attack / XP |
| --- | --- | --- |
| Potion | 13 / 1 / 5 | 16 / 1 / 10 |
| Weapon | 10 / 4 / 5 | 10 / 7 / 10 |
| Treasure | 16 / 7 / 20 | 22 / 13 / 40 |

Assertions confirmed that both item collections already marked the item as
picked up after the first visit, stepping off changed no stats, and movement
reached the expected tile on each step.

Separate in-memory source variants isolated the two defects:

- Correcting only `[nextKey]` produced the same repeated rewards for all three
  item types, while eliminating the stray `"nextKey"` property.
- Adding only `!item.isPickedUp` stopped repeated rewards for all three types.
- Applying both changes stopped repeated rewards and eliminated the stray key.
- Both variants with the guard also left stats unchanged when stepping onto an
  item that was already marked picked up in the initial fixture.

All harness assertions passed. This verifies reducer behavior in isolation;
browser rendering was inspected in source, not exercised in a browser.
At investigation time, `package.json` defined `npm test` as
`echo 'not implemented'` and provided no regression coverage.

## Proposed fix

Apply these two changes in `app/reducers/map-reducer.js`:

```diff
@@
-        if (item) {
+        if (item && !item.isPickedUp) {
@@
-              nextKey: item
+              [nextKey]: item
```

The guard must surround both the effect switch and pickup bookkeeping. This
retains consumed entries for the existing renderer and mob movement rules while
ensuring each item applies its effects only once. A falsy or absent flag remains
eligible, which matters because generated items currently omit `isPickedUp`
(`app/utils/generate/generate.js:210-224`).

The pickup code also mutates the incoming player and item objects. As a related
Redux correctness improvement, copy the player before changing its stats, create
a new item with `isPickedUp: true`, and use that item in both the coordinate map
and objects array. This avoids depending on shared references to synchronize
the collections. Immutability alone does not replace the eligibility guard.

When implementing, add deterministic reducer regression coverage for each item
type: the first pickup grants its reward, leaving and revisiting grants nothing,
an initially consumed item grants nothing, and a different unconsumed item still
works. Verify both initially false and omitted flags, matching generated data.
Also assert that both item collections reflect consumption and the map gains no
literal `"nextKey"` property. If adopting immutable updates, assert that the
input player, item, and collections remain unchanged.

## Implementation status

Applied the two-line fix above. The broader Redux mutation cleanup remains
separate from this fix.

Added `test/item-pickup.js` and wired it to `npm test`. Its 12 deterministic
reducer tests cover potions, weapons, and treasure: first pickup with false or
omitted flags, repeated revisits, another unconsumed item, initially consumed
items, and coordinate-only map keys. All 12 failed against the original code
with the expected repeated rewards or stray map key, and all 12 pass after the
fix. The harness adapts module
syntax and stubs floor generation without installing the legacy build toolchain.

Co-Authored-By: Codex <codex@users.noreply.github.com>
