import Board from "./components/Board/Board";
import Toggle from "./components/Toggle/Toggle";
import { useDropzone } from "react-dropzone";
import useStore from "./utils/store";

function App() {
  const { skin, setSkin } = useStore();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (file) => onDrop(file),
  });

  const onDrop = (file) => {
    const src = URL.createObjectURL(file[0]);
    setSkin(src);
  };

  return (
    <div>
      <div className="die-container">
        {/* <video src="/loser.mp4" id="die-video" className="die-video"></video> */}
        <div className="gameOver">
          <h1>T'es mort !</h1>
        </div>
      </div>
      
      <video
        src="/nether.mp4"
        id="nether-video"
        className="nether-video"
        autoPlay
        loop
        muted
      ></video>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {skin && <img src={skin} alt="" />}
      </div>

      <div className="flashbang"></div>
      <Board />
      <div className="toggle-wrapper">
        <Toggle mode={"Corner"} />
        <Toggle mode={"Impossible"} />
        <Toggle mode={"Reversed"} />
      </div>
      <div className="tree"></div>
    </div>
  );
}

export default App;
