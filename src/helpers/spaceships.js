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
    
    // Glider
    next[2][2] = 1;
    next[3][3] = 1;
    next[3][4] = 1;
    next[4][3] = 1;
    next[4][2] = 1;

    // Light-weight spaceship (LWSS)
    next[7][2] = 1;
    next[10][2] = 1;
    next[11][3] = 1;
    next[11][4] = 1;
    next[11][5] = 1;
    next[10][5] = 1;
    next[9][5] = 1;
    next[8][5] = 1;
    next[7][4] = 1;
    
    // Heavy-weight spaceship (LWSS)
    next[11][8] = 1;
    next[13][7] = 1;
    next[14][7] = 1;
    next[16][8] = 1;
    next[17][9] = 1;
    next[17][10] = 1;
    next[17][11] = 1;
    next[16][11] = 1;
    next[15][11] = 1;
    next[14][11] = 1;
    next[13][11] = 1;
    next[12][11] = 1;
    next[11][10] = 1;
    
    return next;
}