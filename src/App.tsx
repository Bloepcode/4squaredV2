import { useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";
import Manager, { Color } from "./Manager";
import Modal from "./Modal";
import Sidebar from "./Sidebar";

function App() {
  const [gameOverModel, setGameOverModel] = useState(false);
  const [gameOverModelWinnerText, setGameOverModelWinnerText] = useState("");

  const man = Manager.instance || new Manager();

  const boardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      boardRef.current,
      {
        scale: 0.9,
      },
      {
        scale: 0.95,
        delay: 2.3,
      }
    );

    man.registerWin((winner) => {
      setGameOverModelWinnerText(
        winner === Color.WHITE ? "White won!" : "Black won!"
      );
      setGameOverModel(true);
    });
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {gameOverModel && (
        <Modal
          title={gameOverModelWinnerText}
          actions={["restart"]}
          onClose={() => {
            setGameOverModel(false);
          }}
          onAction={(action) => {
            if (action === "restart") {
              man.restart();
              setGameOverModel(false);
            }
          }}
        >
          Game over...
        </Modal>
      )}
      <div
        ref={boardRef}
        className="w-full h-screen overflow-hidden flex justify-center content-center"
      >
        {man.createTiles()}
      </div>
      <Sidebar
        OnRestart={() => {
          man.restart();
        }}
      ></Sidebar>
    </div>
  );
}

export default App;
