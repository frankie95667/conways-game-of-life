import React, { Fragment, useEffect, useRef } from "react";
import Sketch from "react-p5";
import oscillators from "../helpers/oscillators";
import stillLife from "../helpers/still-lifes";
import spaceships from "../helpers/spaceships";
import randomBoard from "../helpers/random-board";
import {PlayArrow, Stop} from "@material-ui/icons";

export default (props) => {
  const intervals = useRef(100);
  const start = useRef(false);
  const back = useRef(false);
  const generation = useRef(0);
  const genInput = useRef();
  let w = 10;
  let columns;
  let rows;
  let board;
  let next;
  let forwardInterval;
  let backwardInterval;
  let history = []

  useEffect(() => {
    const intervalInput = document.getElementById("interval-input");
    intervalInput.setAttribute("value", intervals.current);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef);
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
      setForwardInterval();
      setBackwardInterval();
  };

  const draw = (p5) => {
    p5.clear();
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

  const setForwardInterval = () => {
    forwardInterval = setInterval(() => {
      if (start.current) {
        generate();
      }
    }, intervals.current);
  };

  const setBackwardInterval = () => {
    backwardInterval = setInterval(() => {
      if (back.current) {
        backtrack();
      }
    }, intervals.current)
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
  
  function generate(gen=null) {
    let temp;
    let tempBoard = board;
    if(gen != null && gen - generation.current >= 0){
      gen -= generation.current;
    } else if(gen != null && gen - generation.current < 0){
      history = history.slice(0,gen+1);
      board = history.pop()
      generation.current = gen;
      updateGeneration();
      return
    } else {
      gen = 1;
    }
    
    while (gen > 0) {
      for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
          let neighbors = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              neighbors += tempBoard[x + i][y + j];
            }
          }
          
          neighbors -= tempBoard[x][y];
          if (tempBoard[x][y] === 1 && neighbors < 2) next[x][y] = 0;
          else if (tempBoard[x][y] === 1 && neighbors > 3) next[x][y] = 0;
          else if (tempBoard[x][y] === 0 && neighbors === 3) next[x][y] = 1;
          else next[x][y] = tempBoard[x][y];
        }
      }
      history.push(tempBoard.map(columns => columns.map(rows => rows)))
      temp = tempBoard;
      tempBoard = next;
      generation.current++;
      next = temp;
      gen -= 1;
    }

    board = tempBoard;
    updateGeneration();
  }

  const backtrack = () => {
    history = history.slice(0,generation.current)
    if(history.length > 0){
      let temp = board;
      board = history.pop();
      next = temp;
      generation.current--;
      updateGeneration();
    }
  }

  const updateGeneration = () => {
    const generationText = document.getElementById("generation");
    generationText.textContent = "Generation: " + generation.current;
  };

  const postToCellCoords = (w, pos) => {
    return Math.floor(pos / w);
  };
  
  const playForwardClick = (e) => {
    e.preventDefault();
    start.current = !start.current;

    // assign button elements to variables
    const forwardBtn = document.getElementById("play-forward");
    const backwardBtn = document.getElementById("play-backward");
    const stepBtn = document.getElementById("step-btn");
    const backBtn = document.getElementById("back-btn");
    const reset = document.getElementById("reset-btn");
    
    if (start.current) {
      forwardBtn.innerHTML = "&#x25A0";
      backwardBtn.setAttribute("disabled", true);
      reset.setAttribute("disabled", true);
      stepBtn.setAttribute("disabled", true);
      backBtn.setAttribute("disabled", true);
      toggleGeneratorButtons(true);
    } else {
      forwardBtn.innerHTML = "&#9658;";
      backwardBtn.removeAttribute("disabled");
      reset.removeAttribute("disabled");
      stepBtn.removeAttribute("disabled");
      backBtn.removeAttribute("disabled");
    }
  };

  const playBackwardClick = (e) => {
    e.preventDefault();
    back.current = !back.current;

    // assign button elements to variables
    const forwardBtn = document.getElementById("play-forward");
    const backwardBtn = document.getElementById("play-backward");
    const stepBtn = document.getElementById("step-btn");
    const backBtn = document.getElementById("back-btn");
    const reset = document.getElementById("reset-btn");

    if (back.current) {
      backwardBtn.innerHTML = "&#x25A0";
      forwardBtn.setAttribute("disabled", true);
      reset.setAttribute("disabled", true);
      stepBtn.setAttribute("disabled", true);
      backBtn.setAttribute("disabled", true);
      toggleGeneratorButtons(true);
    } else {
      backwardBtn.innerHTML = "&#9668;";
      forwardBtn.removeAttribute("disabled");
      reset.removeAttribute("disabled");
      stepBtn.removeAttribute("disabled");
      backBtn.removeAttribute("disabled");
    }
  };
  
  const toggleGeneratorButtons = (set = false) => {
    const oscillatorBtn = document.getElementById("oscillator-btn");
    const stillLifeBtn = document.getElementById("still-life-btn");
    const spaceshipBtn = document.getElementById("spaceship-btn");
    const randomBtn = document.getElementById("random-btn");
    
    if (set) {
      oscillatorBtn.setAttribute("disabled", true);
      stillLifeBtn.setAttribute("disabled", true);
      spaceshipBtn.setAttribute("disabled", true);
      randomBtn.setAttribute("disabled", true);
    } else {
      oscillatorBtn.removeAttribute("disabled");
      stillLifeBtn.removeAttribute("disabled");
      spaceshipBtn.removeAttribute("disabled");
      randomBtn.removeAttribute("disabled");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearInterval(forwardInterval);
    clearInterval(backwardInterval);
    setForwardInterval();
    setBackwardInterval();
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
      history = []
      generation.current = 0;
      updateGeneration();
      toggleGeneratorButtons();
    }
  };

  const handleGenInput = (e) => {
    genInput.current = Number(e.target.value);
  };

  const handleGenSubmit = (e) => {
    e.preventDefault();
    generate(genInput.current);
  };

  const generateOscillators = () => {
    board = oscillators(columns, rows);
  };

  const generateStillLife = () => {
    board = stillLife(columns, rows);
  };

  const generateSpaceships = () => {
    board = spaceships(columns, rows);
  };

  const generateRandom = () => {
    board = randomBoard(columns, rows);
  };

  return (
    <Fragment>
      <p>
        Select the squares on the grid to set the cell as either dead or alive.
        You can even drag the mouse to select many cells at a time.
      </p>
      <p>
        After your done, you can press Start and watch as your cells come to
        life.
      </p>
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
        mouseDragged={mouseDragged}
      />
      <h4 id="generation">Generation: {generation.current}</h4>

      <button id="back-btn" onClick={backtrack}>
        &#9668;&#9668;
      </button>
      <button id="play-backward" onClick={playBackwardClick}>
        &#9668;
      </button>
      <button id="play-forward" onClick={playForwardClick}>
        &#9658;
      </button>
      <button id="step-btn" onClick={() => generate()}>
        &#9658;&#9658;
      </button>
      <form onSubmit={handleGenSubmit}>
        <label htmlFor="gen-input">Goto Gen: </label>
        <input id="gen-input" name="gen-input" onChange={handleGenInput} />
        <button type="submit">Go</button>
      </form>
      <form onSubmit={handleSubmit}>
        <label htmlFor="interval-input">Set Interval</label>
        <input name="interval" id="interval-input" onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
      <button id="reset-btn" onClick={resetBoard}>
        Reset
      </button>
      <button id="oscillator-btn" onClick={generateOscillators}>
        Oscillators
      </button>
      <button id="still-life-btn" onClick={generateStillLife}>
        Still Life
      </button>
      <button id="spaceship-btn" onClick={generateSpaceships}>
        Spaceships
      </button>
      <button id="random-btn" onClick={generateRandom}>
        Random
      </button>
    </Fragment>
  );
};
