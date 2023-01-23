import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Manager, { Color } from "./Manager";

type OnClickHandler = (i: number) => void;

interface TileProps {
  state: Color;
  other: boolean;
  i: number;
  onclick: OnClickHandler;
}

export default function TileC(props: TileProps) {
  const man = Manager.instance || new Manager();

  const tileRef = useRef(null);
  const colRef = useRef(null);

  var [state, setState] = useState(props.state);

  man.registerClick(props.i, (data) => {
    setState(data.newState);
  });

  var col = "#363636";
  if (props.other) {
    col = "#252525";
  }

  var insideCol = "transparent";
  if (state === Color.WHITE) {
    insideCol = "#BEBEBE";
  } else if (state === Color.BLACK) {
    insideCol = "#040404";
  }
  useLayoutEffect(() => {
    if (state !== Color.EMPTY) {
      gsap.fromTo(
        colRef.current,
        {
          backgroundColor: insideCol,
        },
        {
          scale: 0.8,
          backgroundColor: insideCol,
          zIndex: 10,
        }
      );
    } else {
      gsap.to(colRef.current, {
        scale: 0,
      });
    }
  });
  useEffect(() => {
    gsap.from(colRef.current, {
      scale: 0,
      backgroundColor: insideCol,
      zIndex: 10,
    });
    gsap.from(tileRef.current, {
      backgroundColor: col,
      opacity: 0,
      scale: 0,
      borderRadius: "100%",
      rotate: 45,
    });
    gsap
      .timeline()
      .to(tileRef.current, {
        backgroundColor: col,
        opacity: 1,
        scale: 0.9,
        borderRadius: "0%",
        rotate: 0,
        duration: 1,
        delay: props.i * 0.007 + 0.5,
      })
      .to(tileRef.current, {
        scale: 1,
        delay: man.w * man.h * 0.007 - props.i * 0.007 - 0.4,
      });
  }, []);

  return (
    <div
      className="inline-block w-full h-full relative"
      onClick={(e) => props.onclick(props.i)}
      ref={tileRef}
      onMouseEnter={() => {
        gsap.to(tileRef.current, {
          scale: 0.9,
          duration: 0.25,
        });
      }}
      onMouseLeave={() => {
        gsap.to(tileRef.current, {
          scale: 1,
          duration: 0.25,
        });
      }}
      onMouseDown={() => {
        gsap.to(tileRef.current, {
          scale: 0.85,
          duration: 0.1,
        });
      }}
      onMouseUp={() => {
        gsap.to(tileRef.current, {
          scale: 0.9,
          duration: 0.25,
        });
      }}
    >
      <div
        ref={colRef}
        className="w-full h-full rounded-full pointer-events-none absolute top-0 bg-red left-0 z-40"
      ></div>
    </div>
  );
}
