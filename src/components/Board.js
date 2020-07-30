import React, { Fragment, useEffect, useRef } from "react";
import Sketch from "react-p5";
import oscillators from "../helpers/oscillators";
import stillLife from "../helpers/still-lifes";
import spaceships from "../helpers/spaceships";
import randomBoard from "../helpers/random-board";
import styled from "styled-components";

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
  let history = [];

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

    if (start.current || back.current || p5.mouseIsPressed) {
      p5.loop();
    } else {
      p5.noLoop();
    }

    // p5.colorMode(p5.RGB);
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
    p5.loop();
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
    p5.loop();
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

  function generate(gen = null) {
    let temp;
    let tempBoard = board;
    if (gen != null && gen - generation.current >= 0) {
      gen -= generation.current;
    } else if (gen != null && gen - generation.current < 0) {
      history = history.slice(0, gen + 1);
      board = history.pop();
      generation.current = gen;
      updateGeneration();
      return;
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
      history.push(tempBoard.map((columns) => columns.map((rows) => rows)));
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
    history = history.slice(0, generation.current);
    if (history.length > 0) {
      let temp = board;
      board = history.pop();
      next = temp;
      generation.current--;
      updateGeneration();
    }
  };

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
      history = [];
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
    if (!start.current && !back.current) {
      board = oscillators(columns, rows);
    }
  };

  const generateStillLife = () => {
    if (!start.current && !back.current) {
      board = stillLife(columns, rows);
    }
  };

  const generateSpaceships = () => {
    if (!start.current && !back.current) {
      board = spaceships(columns, rows);
    }
  };

  const generateRandom = () => {
    if (!start.current && !back.current) {
      board = randomBoard(columns, rows);
    }
  };

  return (
    <Container>
      <h1>Conway's Game of Life</h1>
      <GameWrapper>
        <BoardWrapper>
          <GenerationHeader id="generation">
            Generation: {generation.current}
          </GenerationHeader>
          <GameCanvas
            setup={setup}
            draw={draw}
            mousePressed={mousePressed}
            mouseDragged={mouseDragged}
          />
        </BoardWrapper>
        <RulesWrapper>
          <h2>Rules</h2>
          <ul style={{ paddingInlineStart: "20px" }}>
            <li>
              If the cell is alive and has 2 or 3 neighbors, then it remains
              alive. Else it dies.
            </li>
            <li>
              If the cell is dead and has exactly 3 neighbors, then it comes to
              life. Else if remains dead.
            </li>
          </ul>
          <div style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap"}}>
          <h3 style={{marginTop: "5px", marginBottom: "5px", width: "100%", textAlign: "left"}}>Auto-Generated Boards</h3>
          <GeneratorButtons>
            <div>
              <h5>Pulsars</h5>
              <button id="oscillator-btn" onClick={generateOscillators}>
                <PreGenImg src="Game_of_life_pulsar.gif" />
              </button>
            </div>
            <div>
              <h5>Still Life</h5>
              <button id="still-life-btn" onClick={generateStillLife}>
                <PreGenImg src="1024px-Game_of_life_block_with_border.svg.png" />
              </button>
            </div>
            <div>
              <h5>Spaceships</h5>
              <button id="spaceship-btn" onClick={generateSpaceships}>
                <PreGenImg src="Animated_Hwss.gif" />
              </button>
            </div>
            <div>
              <h5>Random</h5>
              <button id="random-btn" onClick={generateRandom}>
                <PreGenImg src="Game_of_life_random.png" />
              </button>
            </div>
          </GeneratorButtons>
          </div>
        </RulesWrapper>
      </GameWrapper>
      <ButtonsWrapper>
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
        <button id="reset-btn" onClick={resetBoard}>
          Reset
        </button>
        <FormWrapper>
          <form onSubmit={handleGenSubmit}>
            <label htmlFor="gen-input">Jump to generation: </label>
            <InputWrapper>
              <input
                id="gen-input"
                name="gen-input"
                onChange={handleGenInput}
              />
              <button type="submit">Go</button>
            </InputWrapper>
          </form>
          <form onSubmit={handleSubmit}>
            <label htmlFor="interval-input">Set speed in milliseconds</label>
            <InputWrapper>
              <input
                name="interval"
                id="interval-input"
                onChange={handleChange}
              />
              <button type="submit">Save</button>
            </InputWrapper>
          </form>
        </FormWrapper>
      </ButtonsWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

const GameWrapper = styled.div`
  display: flex;
  max-width: 820px;
  margin: 0 auto 20px auto;
`;

const GenerationHeader = styled.h4`
  text-align: center;
`;

const BoardWrapper = styled.div`
  margin-right: 15px;
  width: 50%;
`;

const RulesWrapper = styled.div`
  text-align: left;
  margin-top: 0px;
  margin-left: 15px;
  width: 50%;
`;

const InputWrapper = styled.div`
  display: flex;
  margin-right: 20px;
`;

const FormWrapper = styled.div`
  display: flex;
  text-align: left;
  justify-content: center;
  margin-top: 15px;
`;

const ButtonsWrapper = styled.div`
  width: 820px;
  text-align: center;
  margin: 0 auto;
`;

const GameCanvas = styled(Sketch)`
  margin-top: 10px;
`;

const PreGenImg = styled.img`
  height: 64px;
  width: auto;
`;

const GeneratorButtons = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 250px;
  text-align: center;

  h5 {
    margin-top: 10px;
  }
`;
