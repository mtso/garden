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

state
1. tiles (both floors and columns) are stored in an array of objects that contain tile type and point locations
1. objects (potions, weapons, exit portal/boss crown) are stored in an array of objects that contain object type and point locations
  1. objects also store whether they have been picked up or not.
  1. objects that have been picked up cannot be used again
  1. portal/boss pickup initiates a level reload or game over
1. movable entities (enemies, player)
  1. enemies have a current position, alive/dead bool, isEngaged bool, health value, attack value

1. enemy entities may only move onto floor tiles that do not have valid objects or other entities
1. player may move onto any floor tile as long as a potential object occupying the floor is not the boss or an enemy entity

view rendering steps
1. tiles do not change state within a single round
1. objects that are placed on top of a column should convert the column into a floor tile
  1. each cell of tiles are joined by spaces
  1. each row of tiles are joined by newlines
1. object's values are placed into the map by type (portal and boss always takes up three spaces)
1. movable entities are placed


loop
1. take player input
  1. calculate next location
    1. IF next location is an enemy entity or boss entity
      1. attack based on attack power
      1. take damage based on enemy or boss power
      1. set enemy to isEngaged
      1. do not move player position
    1. ELSE validate player input:
      1. must be floor tile
      1. if next location contains an object (potion or weapon)
        1. apply stats
      1. if next location contains the exit portal (♦)
        1. set state to advance floor
      1. move into location
1. for each enemy that is alive and not engaged
  1. try to move in a random direction
    1. while it has not tried four cardinal directions
      1. roll a random direction
        1. validate next location
          1. must be floor tile
          1. must not be object
          1. must not be enemy entity
            1. move into location
1. reset any engaged enemies
1. render view

## Style

```
font-family: Monaco, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
```

## Game Scene sketch
```
   Lv.4 [:::::::.  ]                                   12♥  4♠





                          . .         .        
                      I I . . . . . . .        
                                .         I .  
                    . . .       .         ♠ .  
                    . . ♣     I . I I     I . .
                    I I I     . . . Ø       . .
                              . . . .       .  
                  .       . . . ¶ . . . . . . I
                  .       .               . . .
                  .       .               ♣ . .
                  I       . I I I         . . .
                          . . . .         . .  
                    . . . . . # . . . . . . .  
                      .   I I I I       .      






```

## Characters

```
(♦) portal
♠	♥	♦	♣
≈≈ bacon?
¶¿Ð×Ø©®¡¤^~  [x]
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
  . . . .                                   I I . I        
  I I . I                                       .          
      .               I I I I   I I I I I       .          
      . I I           . . . .   . . . . .   I I . I I      
      .).).>. . . . . . . . . . . .(.). .   . # . . .      
      I I I           I I I I   . . . . . . . . . T .      
                                I I I I I   . . . . .      
                                            I I I I I      


```
