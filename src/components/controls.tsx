import { Button, ButtonGroup } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { PiDeviceRotateBold } from "react-icons/pi";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";

interface TTButtonProps {
  name: string;
  clickHandler: () => void;
  disabled: boolean;
  icon: JSX.Element;
}

export function Controls() {
  const context = useContext(AppContext);
  const [pause, setPause] = useState(false);
  const [showingIndex, setShowingIndex] = useState(0);
  if (!context) {
    throw new Error();
  }

  const {
    state: { moveIndex, Game, analysis, boardStage, index2, fen },
    dispatch,
  } = context;
  if (!Game) {
    throw new Error();
  }
  const n_moves = Game.history().length;
  const atEnd = moveIndex === n_moves - 1;
  const atStart = moveIndex === -1;

  const prevShowingIndexRef = useRef<number | null>(null);

  const linesToShow =
    boardStage === "bestMove" && analysis !== undefined
      ? analysis[index2].fenLines
      : undefined;
  const linesAtEnd = linesToShow
    ? showingIndex === linesToShow.length - 1
    : false;
  const linesAtStart = showingIndex === 0;

  useEffect(() => {
    if (linesToShow && linesToShow.length !== 0) {
      const currentFen = linesToShow[showingIndex];

      if (
        prevShowingIndexRef.current !== showingIndex &&
        fen &&
        fen !== currentFen
      ) {
        try {
          dispatch({ type: "SetFen", fen: currentFen });
          prevShowingIndexRef.current = showingIndex;
        } catch (error) {
          console.error(`Sorry, can't show moves: ${error}`);
        }
      }
    }
  }, [showingIndex, linesToShow, dispatch, fen]);

  useEffect(() => {
    if (boardStage === "bestMove") {
      setPause(true);
      setShowingIndex(0);
    } else if (boardStage === "normal") {
      setPause(false);
    }
  }, [boardStage]);

  useEffect(() => {
    if ((linesToShow && linesAtEnd) || atEnd) {
      setPause(false);
    }

    if (pause) {
      const crrMove = setInterval(() => {
        if (boardStage === "bestMove" && linesToShow && !linesAtEnd) {
          setShowingIndex((prevIndex) => prevIndex + 1);
        } else if (boardStage === "normal" && moveIndex < n_moves - 1) {
          dispatch({ type: "SetIndex", index: moveIndex + 1 });
        }
      }, 500);

      return () => clearInterval(crrMove);
    }
  }, [
    pause,
    linesToShow,
    linesAtEnd,
    showingIndex,
    boardStage,
    atEnd,
    moveIndex,
    n_moves,
    dispatch,
  ]);

  const controlButtons: TTButtonProps[] = [
    {
      name: "Flip Board",
      clickHandler: () => dispatch({ type: "FlipBoard" }),
      disabled: false,
      icon: <PiDeviceRotateBold className="rotate-90 text-2xl scale-125" />,
    },
    {
      name: "Starting Position",
      clickHandler: () => dispatch({ type: "SetIndex", index: -1 }),
      disabled: atStart,
      icon: <FaStepBackward />,
    },
    {
      name: "Previous Move",
      clickHandler: () => {
        if (boardStage === "normal") {
          dispatch({ type: "SetIndex", index: moveIndex - 1 });
        } else if (boardStage === "bestMove") {
          setShowingIndex(showingIndex - 1);
        }
      },
      disabled: boardStage === "normal" ? atStart : linesAtStart,
      icon: <FaArrowLeft />,
    },
    {
      name: pause ? "Play" : "Pause",
      clickHandler: () => {
        setPause((prevPause) => !prevPause);
      },
      disabled: boardStage === "normal" ? atEnd : linesAtEnd,
      icon: pause ? <FaPause /> : <FaPlay />,
    },
    {
      name: "Next Move",
      clickHandler: () => {
        if (boardStage === "normal") {
          dispatch({ type: "SetIndex", index: moveIndex + 1 });
        } else if (boardStage === "bestMove") {
          setShowingIndex(showingIndex + 1);
        }
      },
      disabled: boardStage === "normal" ? atEnd : linesAtEnd,
      icon: <FaArrowRight />,
    },
    {
      name: "Last Move",
      clickHandler: () => dispatch({ type: "SetIndex", index: n_moves - 1 }),
      disabled: atEnd,
      icon: <FaStepForward />,
    },
    {
      name: "Reset",
      clickHandler: () => dispatch({ type: "ChangeState", stage: "first" }),
      disabled: false,
      icon: <FaArrowsRotate />,
    },
  ];

  return (
    <ButtonGroup>
      {controlButtons.map((BP) => (
        <TTButton key={BP.name} {...BP} />
      ))}
    </ButtonGroup>
  );
}

const TTButton: FC<TTButtonProps> = ({
  name,
  clickHandler,
  icon,
  disabled,
}) => {
  return (
    <Tooltip color="primary" showArrow={true} content={name}>
      <Button
        onClick={clickHandler}
        isDisabled={disabled}
        style={{ minWidth: 12 }}
        color="primary"
        size="sm"
        className="text-2xl"
        variant="light">
        {icon}
      </Button>
    </Tooltip>
  );
};
