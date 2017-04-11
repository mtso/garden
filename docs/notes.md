# Notes

Perhaps even field of view is a function of player level=

initial generated data consists of two things:
the board: an array of floor or wall objects (each object contains tile type and point location)
the objects:
treasures, items, enemies, spawn point,

Items have a function that take in the player as a parameter and returns a new player? (mutates the player's stats) (which are level, exp, health, attack, armor?)

Each level of experience increases the chance of encountering the boss floor
Each level also increases the size of the next floor
A higher power level of your weapon and armor also increases the chance of encountering the boss floor

player object needs to have health, level, weapon, position, experience (level)
item types are: weapon, health augmentation


each cell should keep track of the last time the player stepped through

each component needs to update for each loop (one player step)

## Rendering
need to save rendered reference map of each floor tileset

it's possible to move up floors without touching any object
higher floors increase heal strength, weapon pickups, and enemy attack and hp
boss grows in strength per floor advanced
higher exp increases boss floor encounter
gain exp when picking up health, weapons, treasures
gain small exp when advancing floor

state:
```
{
  tiles: [
    {type: FLOOR, position: {x: 1, y: 1}},
    {type: WALL, position: {x: 1, y: 0}},
    ...
  ],
  objects: [
    {type: POTION, position: {x: 1, y: 1}, pickedUp: true},
    {type: TREASURE, position: {x: 1, y: 1}, pickedUp: true}
    {type: WEAPON, position: {x: 1, y: 1}, pickedUp: false},
    {type: EXIT, position: {x: 1, y: 1}},
    /*or {type: BOSS, position: {x: 1, y: 1}, health: 30, attack: 40},*/
  ],
  entities: [
    {health: 4, attack: 4, position: {x: 4, y: 6}},
    ...
  ],
  player: {
    hp: 6,
    attack: 2,
    position: {x: 3, y: 2},
    exp: 45
  }
}
```
state
- tiles (both floors and columns) are stored in an array of objects that contain tile type and point locations
- objects (potions, weapons, exit portal/boss crown) are stored in an array of objects that contain object type and point locations
  - objects also store whether they have been picked up or not.
  - objects that have been picked up cannot be used again
  - portal/boss pickup initiates a level reload or game over
- movable entities (enemies, player)
  - enemies have a current position, alive/dead bool, isEngaged bool, health value, attack value

1. enemy entities may only move onto floor tiles that do not have valid objects or other entities
1. player may move onto any floor tile as long as a potential object occupying the floor is not the boss or an enemy entity

view rendering steps
1. tiles do not change state within a single round
1. objects that are placed on top of a column should convert the column into a floor tile
1. join each cell of tiles with spaces
1. join each row of tiles with newlines
1. object's values are placed into the map by type (portal and boss always takes up three spaces)
1. movable entities are placed
1. add statues


loop
- take player input
  - calculate next location
    - IF next location is an enemy entity or boss entity
      - attack based on attack power
      - take damage based on enemy or boss power
      - set enemy to isEngaged
      - do not move player position
    - ELSE validate player input:
      - must be floor tile
      - if next location contains an object (potion or weapon)
        - apply stats
      - if next location contains the exit portal (♦)
        - set state to advance floor
      - move into location
- for each enemy that is alive and not engaged
  - try to move in a random direction
    - while it has not tried four cardinal directions
      - roll a random direction
        - validate next location
          - must be floor tile
          - must not be object
          - must not be enemy entity
            - move into location
- reset any engaged enemies
- render view

## Style

```
font-family: Monaco, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
```

## Game Scene sketch
L4 denotes floor number,

alt status bar
```
Lv.4 [:::::::.  ]                                   12♥  4♠
```

Message bar with matching flourishes
❧☙
~~
```
                                  ❧ I seem to have lost my way ☙
                  
                  
                  
                                          . .         .        
                                      I I . . . . . . .        
                                                .         I .  
                                    . . .       .         ♠ .  
                                    . . ♥     I . I I     I . .
                                    I I I     . . . Ø       . .
                                              . . . .       .  
                                  .       . . . ¶ . . . . . . I
                                  .       .               . . .
                                  .       .               ♥ . .
                                  I       . I I I         . . .
                                          . . . .         . .  
                                    . . . . . # . . . . . . .  
                                      .   I I I I       .      
                  
                  
                  
                  
                  
                                        ④  ♣23  ♥12  ♠4
```

## Characters

```

④①№
(♦) portal
♠	♥	♦	♣
≈≈ bacon?
¶¿Ð×Ø © ®¡¤^~  [x]
```

## Art

Multiline statue
```
" /\\-/\\ \n(=^Y^=)\n (>o<) "
```

Cute non-garden ASCII arts.
```
"@('_')@",
"(-.-)_.zZ",
"~~~{,_,\">",
.\|_
```

Problematic (bad-spacing) art
```
Ƹ̵̡Ӝ̵̨̄Ʒ
くコ:彡
"≧◔◡◔≦﻿",
"☃",


```

## Boss Room
```
H H H H H
. . . . .
. .\&/. .
. . . . .
H H . H H



  H H H
  . ^ .
  H . H
    .
    .
    .
H H . H H
. . . . .
. .\&/. .
. . . . .
H H . H H
```


Sketch
Boss crown is not a problem because the slashes do not overlap any occupy-able space.
```
I I I   I I I I                                 I I I I I  
T . . . . . . .       I I I                     . # . . .  
I I I   . . . H . . . . . . .                   . #(♦). .  
        I I I I       I I I .     I I I I I     . . . . .  
                            .     . . . . .     I I . I I  
                            .     . . . H . . . . . .      
                            .     . . . . .   .            
I I I I                     .     I I . I I   .            
. . . .                   I . I       .       .            
. . . .   I I\I/. . . . . . . . . . . .       .            
I I . I   H . . . . .     I I .           I I . I I        
    .     . . . . . .       ((.))         . . . . .        
    . . . . . .[,]. .   ^ↀᴥↀ^ .           . . S . H        
          . . . . . .     I I . I I       . . . . .        
          I I I I I I     . . . . .       I I I . I        
                          . .\&/. .             .          
                          . . . . .             .          
                          I I I I I         I I . I        
  I I I I                                   . . . .        
  . . . H                                   . . . .        
  ? . . .                                   I I . I        
  I I . I                                       .          
      .               I I I I   I I I I I       .          
      . I I           . . . .   . . . . .   I I . I I      
      .).).>. . . . . . . . . . . .(.). .   . # . . .      
      I I I           I I I I   . . . . . . . . . T .      
                                I I I I I   . . . . .      
                                            I I I I I      


```
