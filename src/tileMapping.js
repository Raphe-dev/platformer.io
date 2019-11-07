const TILE_MAPPING = {
    WALL: {
      TOP_LEFT: [[16, 17],[32,33]],
      TOP_RIGHT: [[21, 22],[37,38]],
      BOTTOM_RIGHT: [ [101, 102], [117, 118] ],
      BOTTOM_LEFT: [ [96, 97], [112, 113] ],
      // Let's add some randomization to the walls while we are refactoring:
      TOP: [[18],[34]],
      LEFT: [80, 81],
      RIGHT: [53, 54],
      BOTTOM: [ [100], [116]]
    },
    FLOOR: [{ index: 2, weight: 9 }, { index: [0, 1, 3], weight: 1 }],
    DOOR: {
      TOP: [ [128, 0, 130], [144, 0, 146] ],
      TOP_OVER: [ 129 ],
      TOP_SHADOW: [ 145 ],
      LEFT: [ [131, 132], [0, 0], [163, 164] ],
      LEFT_OVER: [ 147 ],
      LEFT_SHADOW: [ 148 ],
      BOTTOM: [ [160, 0, 162], [176, 0, 178] ],
      BOTTOM_OVER: [ 177 ],
      BOTTOM_SHADOW: [ 161 ],
      RIGHT: [ [ 133, 134], [0, 0], [165, 166] ],
      RIGHT_OVER: [ 150 ],
      RIGHT_SHADOW: [ 149 ]
    }
    /*
    CHEST: 166,
    STAIRS: 81,
    TOWER: [
      [186],
      [205]
    ]*/
  };
  
  export default TILE_MAPPING;