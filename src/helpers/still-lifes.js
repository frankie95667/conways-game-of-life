export default (columns, rows) => {
    console.log(columns, rows);
    let next = new Array(columns);
    for (let i = 0; i < columns; i++) {
      next[i] = new Array(rows);
    }
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        next[x][y] = 0;
      }
    }
    
    // block
    next[2][2] = 1;
    next[2][3] = 1;
    next[3][3] = 1;
    next[3][2] = 1;

    // Bee-Hive
    next[2][7] = 1;
    next[3][6] = 1;
    next[4][6] = 1;
    next[5][7] = 1;
    next[3][8] = 1;
    next[4][8] = 1;

    // Loaf
    next[2][12] = 1;
    next[3][11] = 1;
    next[4][11] = 1;
    next[5][12] = 1;
    next[5][13] = 1;
    next[4][14] = 1;
    next[3][13] = 1;

    // Boad
    next[9][2] = 1;
    next[10][2] = 1;
    next[9][3] = 1;
    next[10][4] = 1;
    next[11][3] = 1;
    
    return next;
}