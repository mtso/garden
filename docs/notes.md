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

## Style

```
font-family: "SFMono-Regular", 'Monaco' Consolas, "Liberation Mono", Menlo, Courier, monospace;
```

## Game Scene sketch
```
   Lv.4 [:::::::.  ]                                   12♥  4♠





                          . .         .        
                      I I . . . . . . .        
                                .         I .  
                    . . .       .         . .  
                    . . .     I . I I     I . .
                    I I I     . . . Ø       . .
                              . . . .       .  
                  .       . . . ¶ . . . . . . .
                  .       .               . . .
                  .       .               . . .
                  I       . I I I         . . I
                          . . . .         . .  
                    . . . . . # . . . . . . .  
                      .   I I I I       .      






```

## Characters

```
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
```
I I I   I I I I                                 I I I I I  
T . . . . . . .       I I I                     . # . . .  
I I I   . . . H . . . . . . .                   . #(.). .  
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
                          . . . . .             .          
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
