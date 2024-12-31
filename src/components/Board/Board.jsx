import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  netherPortal,
} from "../../utils/utils";
import StartScreen from "../StartScreen/StartScreen";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";

const Board = () => {
  const { mode, removeMode } = useStore();
  const [gameStarted, setGameStarted] = useState(false); 
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ]);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);
  const eatSound = useRef(null);
  const gameOverSound = useRef(null);

  useEffect(() => {
    eatSound.current = new Audio("/audio/eat.mp3");
    gameOverSound.current = new Audio("/audio/gameOver.mp3");
  }, []);

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);
  
    setDeath(death + 1);
  
    const gameOverContainer = document.querySelector(".die-container");
  
    gameOverContainer.style.display = "block"; 
    gameOverContainer.style.opacity = 1;
  
    setGameOver(true);

    if (gameOverSound.current) {
      gameOverSound.current.play().catch((error) => {
        console.error("Erreur de lecture audio :", error);
      });
    }

  
    setTimeout(() => {
      gameOverContainer.style.opacity=0;
  
      setTimeout(() => {
        gameOverContainer.style.display = "none"; 
      }, 1000); 
    }, 1500); 
  };
  

  const isOutOfBorder = (head) => {
    if (head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenItem = ({ getter, setter, isFood }) => {
    const head = snakeData[snakeData.length - 1];

    // comparer les coordonnées de la tête du snake avec LES food
    const item = getter.find(
      (_item) => _item.x === head[0] && _item.y === head[1]
    );

    if (item) {
      // si y'a match on renvoie true

      // mettre à jour le tableau des food disponibles
      const newItemArray = getter.filter((_item) => _item !== item);

      setter(newItemArray);

      if (isFood && eatSound.current) {
        eatSound.current.pause(); // Arrête le son actuel
        eatSound.current.currentTime = 0; // Réinitialise le son au début
        eatSound.current.play().catch((error) => {
          console.error("Erreur de lecture audio :", error);
        });
      }

      return true;
    } else {
      // sinon on renvoie false
      return false;
    }
  };

  const moveSnake = () => {
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    // console.log(head);

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 10, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 10, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 10];

        break;
      case "UP":
        head = [head[0], head[1] - 10];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
      isFood: true,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
      isFood: false,
    });

    // console.log(snakeCollapsed);

    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
        // trap execution logic
        const effects = [flashUser, triggerMode, wizz, netherPortal];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();
      }
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          // console.log("speed =", speed);
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];
    // let head = snake[snake.length - 1];

    // retire la dernière case du tableau
    snake.pop();

    // comparer les coordonnées de head (tête du snake) avec les autres points du snake
    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        // si match renvoie true
        return true;
      }
    }

    // sinon renvoie false
    return false;
  };

  const onKeyDown = (e) => {
    // console.log(e);
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  const addItem = ({ getter, setter }) => {
    // génération de coordonnées
    const coordinates = generateRandomCoordinates(mode);

    //fusion des deux tableaux
    const array = [...foodArray, ...trapArray];

    //test pour savoir si un item est déjà existant à cet endroit
    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    // si ça existe déjà, rappeler la fonction
    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    // console.log(time, deltaTime, frame);
    // console.log("game loop");
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    // ici, gestion de l'apparition de la nourriture
    if (foodTimer.current > 2 && foodArray.length < 20) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    // ici, gestion des pièges
    if (trapTimer.current > 3 && trapArray.length < 10) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }

    if (timer.current > (mode.includes("Impossible") ? 0.02 : speed)) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };

  const replay = () => {
    // replay game

    removeMode("Corner");
    removeMode("Impossible");
    removeMode("Reversed");

    //reset game over
    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2); // reset speed
    setScore(0); // reset score

    //reset data snake
    setSnakeData([
      [0, 0],
      [10, 0],
    ]);
    //reset food
    setFoodArray([]);
    setTrapArray([]);

    //reset direction
    direction.current = "RIGHT";

    //reset timer
    timer.current = 0;

    //reset food timer
    foodTimer.current = 0;
  };

  
  useEffect(() => {
    if (gameStarted) {
      window.addEventListener("keydown", onKeyDown);
      gsap.ticker.add(gameLoop);
    }
  
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(gameLoop);
    };
  }, [gameStarted, snakeData]);
  

  return (
    <>
      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} />
      ) : (
        <>
          {gameOver && (
            <div className={s.gameIsOver}>
              <GameOver replay={replay} />
              {!hasEnteredResults && (
                <Submit
                  score={score}
                  death={death}
                  setHasEnteredResults={setHasEnteredResults}
                />
              )}
              <Scoreboard />
              <div className={s.snake}></div>
              <div className={s.tree}></div>
            </div>
          )}

          <div id="board" className={s.board}>
            <Snake data={snakeData} />
            <span className={s.score}>Score: {score}</span>
            {/* <span className={s.death}>Death: {death}</span> */}
            {foodArray.map((coordinates) => (
              <Item key={coordinates.id} coordinates={coordinates} type="food" />
            ))}
            {trapArray.map((coordinates) => (
              <Item key={coordinates.id} coordinates={coordinates} type="trap" />
            ))}
            <div className={s.tree}></div>
          </div>
        </>
      )}
    </>
  );
};

export default Board;
