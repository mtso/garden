minimum state object:

<!-- {
  map: [
    {
      tile: 'WALL',
      position: {
        x: 4,
        y: 6
      }
    }
  ],
  player: {
    position: {
      x: 4,
      y: 4
    },
    health: 4,
    weapon: 'SWORD',
    level: 2,
    exp: 243
  }
} -->

```
{
  "map": {
    "0:20": {
      "type": "WALL",
      "position": {
        "x": 0,
        "y": 20
      }
    },
    "0:22": {
      "type": "WALL",
      "position": {
        "x": 0,
        "y": 22
      }
    },
    ...
  },
  "mobs": [
    {
      "position": {
        "x": 21,
        "y": 17
      },
      "health": 1,
      "attack": 0,
      isAlive: true
    },
    ...
  ],
  "objects": [
    {
      "type": "POTION",
      "position": {
        "x": 22,
        "y": 26
      },
      "isPickedUp": false
    },
    ...
  ],
  "exit": {
    "x": 7,
    "y": 26
  },
  "spawn": {
    "x": 12,
    "y": 5
  },
  "player": {
    "health": 5,
    "attack": 4,
    "position": {
      "x": 21,
      "y": 26
    },
    "exp": 41
  },
  "floor": 1
}
```
