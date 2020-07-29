import _ from 'underscore';

export default (columns, rows) => {
    const options = [0,0,0,1]
    let next = new Array(columns);
    for (let i = 0; i < columns; i++) {
      next[i] = new Array(rows);
    }
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if(x === 0 || x === columns - 1 || y === 0 || y === columns - 1){
            next[x][y] = 0;
        } else{
            next[x][y] = _.sample(options);
        }
      }
    }
    
    return next;
}