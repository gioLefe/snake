- Different modes

- classic
    - with tiles
    - you die when you touch your tail and borders
- smooth
    - smooth movement
    - you die when you touch borders
    
- Difficulty selector? 
    - easy: die on borders
    - normal: die on borders and tail
    - hard: die on borders and tail, static obstacles (trees, plants, etc.)
    - very hard: die on borders and tail, static obstacles (trees, plants, etc.), enemies spawning and shoot you down

TODO:
- add easing functions
- panel: provide a way to move a cursor with keyboard to select an item in the panel (use withEvents)
- collision detection:
    - optimization of pivot detection

ONGOING:

KNOWN ISSUES:
- Collision of the snakehead is not working anymore since an image is used as the head, the bbox is not calculated
- play button is not returning to its intial state when mouse leaves button