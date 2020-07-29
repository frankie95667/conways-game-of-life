import React, { Fragment, useEffect, useRef } from "react";
import Sketch from "react-p5";
import { useImmer } from "use-immer";

export default (props) => {
  const intervals = useRef(100);
  const start = useRef(false);
  const generation = useRef(0);
  let w = 10;
  let columns;
  let rows;
  let board;
  let next;
  let timeInterval;

  useEffect(() => {
    const intervalInput = document.getElementById("interval-input");
    intervalInput.setAttribute("value", intervals.current);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(600, 600).parent(canvasParentRef);
    columns = p5.width / w;
    rows = p5.height / w;
    board = new Array(columns);
    next = new Array(columns);
    for (let i = 0; i < columns; i++) {
      board[i] = new Array(rows);
      next[i] = new Array(rows);
    }
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        board[x][y] = 0;
        next[x][y] = 0;
      }
    }
    setGameInterval();
  };

  const draw = (p5) => {
    p5.background(240);

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let xpos = x * w;
        let ypos = y * w;

        if (board[x][y]) {
          p5.fill(0);
        } else {
          p5.fill(255);
        }

        p5.stroke(0);
        p5.rect(xpos, ypos, w, w);
      }
    }

    p5.colorMode(p5.RGB);
  };

  const setGameInterval = () => {
    timeInterval = setInterval(() => {
      if (start.current) {
        generate();
      }
    }, intervals.current);
  };

  function insideBoard(p5) {
    if (
      p5.mouseY < columns * w &&
      p5.mouseY >= 0 &&
      p5.mouseX < rows * w &&
      p5.mouseX >= 0
    ) {
      return true;
    }
    return false;
  }

  function mousePressed(p5) {
    if (!start.current && insideBoard(p5)) {
      let xx = Number(postToCellCoords(w, p5.mouseX));
      let yy = Number(postToCellCoords(w, p5.mouseY));
      if (board[xx][yy]) {
        board[xx][yy] = 0;
      } else {
        board[xx][yy] = 1;
      }
    }
  }

  function mouseDragged(p5) {
    if (!start.current && insideBoard(p5)) {
      let xx = Number(postToCellCoords(w, p5.mouseX));
      let yy = Number(postToCellCoords(w, p5.mouseY));
      if (board[xx][yy]) {
        board[xx][yy] = 0;
      } else {
        board[xx][yy] = 1;
      }
    }
  }

  function generate() {
    for (let x = 1; x < columns - 1; x++) {
      for (let y = 1; y < rows - 1; y++) {
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            neighbors += board[x + i][y + j];
          }
        }

        neighbors -= board[x][y];
        if ((board[x][y] === 1 && neighbors < 2) || neighbors > 3)
          next[x][y] = 0;
        else if (board[x][y] === 0 && neighbors === 3) next[x][y] = 1;
        else next[x][y] = board[x][y];
      }
    }

    let temp = board;
    board = next;
    generation.current++;
    updateGeneration();
    next = temp;
  }

  const updateGeneration = () => {
    const generationText = document.getElementById("generation");
    generationText.textContent = "Generation: " + generation.current;
  };

  const postToCellCoords = (w, pos) => {
    return Math.floor(pos / w);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    start.current = !start.current;
    const button = document.getElementById("start-stop");
    const reset = document.getElementById("reset-btn");
    reset.toggleAttribute("disabled")
    if (start.current) {
      button.textContent = "Stop";
    } else {
      button.textContent = "Start";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearInterval(timeInterval);
    setGameInterval();
  };

  const handleChange = (e) => {
    intervals.current = Number(e.target.value);
  };

  const resetBoard = () => {
    if (!start.current) {
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          board[x][y] = 0;
          next[x][y] = 0;
        }
      }
      generation.current = 0;
      setGameInterval();
    }
  };

  return (
    <Fragment>
      <p>Select the squares on the grid to set the cell as either dead or alive. You can even drag the mouse to select many cells at a time.</p>
      <p>After your done, you can press Start and watch as your cells come to life.</p>
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
        mouseDragged={mouseDragged}
      />
      <h4 id="generation">Generation: {generation.current}</h4>
      <button id="start-stop" onClick={handleButtonClick}>
        Start
      </button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="interval-input">Set Interval</label>
        <input name="interval" id="interval-input" onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
      <button id="reset-btn" onClick={resetBoard}>Reset</button>
    </Fragment>
  );
};
