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
    console.log(next);

    // Blinker
    next[5][5] = 1;
    next[6][5] = 1;
    next[7][5] = 1;

    // Toad
    next[11][6] = 1;
    next[12][6] = 1;
    next[13][6] = 1;
    next[12][5] = 1;
    next[13][5] = 1;
    next[14][5] = 1;

    // Beacon
    // top left
    next[5][14] = 1;
    next[5][15] = 1;
    next[5][16] = 1;
    next[7][12] = 1;
    next[8][12] = 1;
    next[9][12] = 1;
    next[10][14] = 1;
    next[10][15] = 1;
    next[10][16] = 1;
    next[9][17] = 1;
    next[8][17] = 1;
    next[7][17] = 1;
    
    // top right
    next[17][14] = 1;
    next[17][15] = 1;
    next[17][16] = 1;
    next[13][12] = 1;
    next[14][12] = 1;
    next[15][12] = 1;
    next[12][14] = 1;
    next[12][15] = 1;
    next[12][16] = 1;
    next[13][17] = 1;
    next[14][17] = 1;
    next[15][17] = 1;

    // bottom left
    next[5][20] = 1;
    next[5][21] = 1;
    next[5][22] = 1;
    next[7][24] = 1;
    next[8][24] = 1;
    next[9][24] = 1;
    next[10][22] = 1;
    next[10][21] = 1;
    next[10][20] = 1;
    next[9][19] = 1;
    next[8][19] = 1;
    next[7][19] = 1;
    
    // bottom right
    next[17][20] = 1;
    next[17][21] = 1;
    next[17][22] = 1;
    next[13][24] = 1;
    next[14][24] = 1;
    next[15][24] = 1;
    next[12][22] = 1;
    next[12][21] = 1;
    next[12][20] = 1;
    next[13][19] = 1;
    next[14][19] = 1;
    next[15][19] = 1;
    
    return next;
}