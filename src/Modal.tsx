import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

type OnAction = (action: string) => void;

interface ModelProps {
  title: string;
  actions: string[];
  children?: ReactNode;
  onClose?: OnAction;
  onAction?: OnAction;
}

export default function Modal(props: ModelProps) {
  const modelRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      modelRef.current,
      {
        scale: 0,
      },
      {
        scale: 1,
      }
    );
  }, []);

  return (
    <div className="z-50 fixed w-full h-screen top-0 left-0 bg-transparent flex justify-center items-center">
      <div ref={modelRef} className="px-8 py-4 bg-zinc-800 text-white">
        <div className="flex gap-12 my-2">
          <h1 className="text-3xl">{props.title}</h1>
          <button
            onClick={() => {
              if (props.onClose) {
                props.onClose("X");
              }
            }}
            className="hover:bg-zinc-900 border-zinc-900 border-2 transition-colors px-2 inline-block"
          >
            X
          </button>
        </div>
        <div className="text-neutral-300">{props.children}</div>

        <div className="flex gap-12 justify-center my-3">
          {props.actions.map((action, i) => {
            return (
              <button
                key={action}
                className="hover:bg-zinc-900 border-zinc-900 border-2 transition-colors px-2 inline-block"
                onClick={() => {
                  if (props.onAction) {
                    props.onAction(action);
                  }
                }}
              >
                {action}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
