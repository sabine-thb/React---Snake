import s from './StartScreen.module.scss';

const StartScreen = ({ onStart }) => {
    return (
      <div className={s.startScreen}>
        <div className={s.content}>
            <h1 className={s.subtitle}>Welcome to</h1>
            <h1 className={s.title}>The Snake Game</h1>
            <button onClick={onStart} className={s.button}>Start</button>
        </div>
        <div className={s.snake}></div>
        <div className={s.buisson}></div>
      </div>
    );
  };

export default StartScreen;
  