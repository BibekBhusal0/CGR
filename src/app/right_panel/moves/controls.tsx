import { Button, ButtonGroup } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { FC, JSX, useEffect, useRef, useState } from "react";
import { icons as all_icons } from "@/components/icons";
import { useGameState } from "@/Logic/state/game";
const icons = all_icons.controls;

interface TTButtonProps {
  name: string;
  clickHandler: () => void;
  disabled: boolean;
  icon: JSX.Element;
}

export function Controls() {
  const moveIndex = useGameState((state) => state.moveIndex);
  const setIndex = useGameState((state) => state.setIndex);
  const fen = useGameState((state) => state.fen);
  const index2 = useGameState((state) => state.index2);
  const boardStage = useGameState((state) => state.boardStage);
  const Game = useGameState((state) => state.Game);
  const flipBoard = useGameState((state) => state.flipBoard);
  const changeState = useGameState((state) => state.changeState);
  const analysis = useGameState((state) => state.analysis);
  const setFen = useGameState((state) => state.setFen);

  const [pause, setPause] = useState(false);
  const [showingIndex, setShowingIndex] = useState(0);
  if (!Game) throw new Error();
  const n_moves = Game.history().length;
  const atEnd = moveIndex === n_moves - 1;
  const atStart = moveIndex === -1;

  const prevShowingIndexRef = useRef<number | null>(null);

  const linesToShow =
    boardStage === "bestMove" && analysis !== undefined ? analysis[index2].fenLines : undefined;
  const linesAtEnd = linesToShow ? showingIndex === linesToShow.length - 1 : false;
  const linesAtStart = showingIndex === 0;

  useEffect(() => {
    if (linesToShow && linesToShow.length !== 0) {
      const currentFen = linesToShow[showingIndex];

      if (prevShowingIndexRef.current !== showingIndex && fen && fen !== currentFen) {
        try {
          setFen(currentFen);
          prevShowingIndexRef.current = showingIndex;
        } catch (error) {
          console.error(`Sorry, can't show moves: ${error}`);
        }
      }
    }
  }, [showingIndex, linesToShow, fen]);

  useEffect(() => {
    if (boardStage === "bestMove") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPause(true);
      setShowingIndex(0);
    } else if (boardStage === "normal") setPause(false);
  }, [boardStage]);

  useEffect(() => {
    if ((linesToShow && linesAtEnd) || atEnd) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPause(false);
    }

    if (pause) {
      const crrMove = setInterval(() => {
        if (boardStage === "bestMove" && linesToShow && !linesAtEnd) {
          setShowingIndex((prevIndex) => prevIndex + 1);
        } else if (boardStage === "normal" && moveIndex < n_moves - 1) {
          setIndex(moveIndex + 1);
        }
      }, 500);

      return () => clearInterval(crrMove);
    }
  }, [pause, linesToShow, linesAtEnd, showingIndex, boardStage, atEnd, moveIndex, n_moves]);

  const togglePlayPause = () => setPause((prevPause) => !prevPause);
  const goToFirstMove = () => {
    setPause(false);
    setIndex(-1);
  };
  const goToLastMove = () => {
    setPause(false);
    setIndex(n_moves - 1);
  };

  const goToPreviousMove = () => {
    setPause(false);
    if (boardStage === "normal") {
      setIndex(moveIndex - 1);
    } else if (boardStage === "bestMove") {
      setShowingIndex(showingIndex - 1);
    }
  };

  const goToNextMove = () => {
    setPause(false);
    if (boardStage === "normal") {
      setIndex(moveIndex + 1);
    } else if (boardStage === "bestMove") {
      setShowingIndex(showingIndex + 1);
    }
  };

  const keyFunctionMapping: Record<string, () => any> = {
    ArrowLeft: goToPreviousMove,
    ArrowRight: goToNextMove,
    ArrowUp: goToFirstMove,
    ArrowDown: goToLastMove,
    " ": togglePlayPause,
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    if (key in keyFunctionMapping) {
      event.preventDefault();
      keyFunctionMapping[key]();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const controlButtons: TTButtonProps[] = [
    {
      name: "Flip Board",
      clickHandler: () => flipBoard(),
      disabled: false,
      icon: icons.flip,
    },
    {
      name: "Starting Position",
      clickHandler: goToFirstMove,
      disabled: atStart,
      icon: icons.first,
    },
    {
      name: "Previous Move",
      clickHandler: goToPreviousMove,
      disabled: boardStage === "normal" ? atStart : linesAtStart,
      icon: icons.previous,
    },
    {
      name: pause ? "Play" : "Pause",
      clickHandler: togglePlayPause,
      disabled: boardStage === "normal" ? atEnd : linesAtEnd,
      icon: pause ? icons.pause : icons.play,
    },
    {
      name: "Next Move",
      clickHandler: goToNextMove,
      disabled: boardStage === "normal" ? atEnd : linesAtEnd,
      icon: icons.next,
    },
    {
      name: "Last Move",
      clickHandler: goToLastMove,
      disabled: atEnd,
      icon: icons.last,
    },
    {
      name: "Reset",
      clickHandler: () => changeState("first"),
      disabled: false,
      icon: icons.reset,
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

const TTButton: FC<TTButtonProps> = ({ name, clickHandler, icon, disabled }) => {
  return (
    <Tooltip color="primary" showArrow={true} content={name}>
      <Button
        onPress={clickHandler}
        isDisabled={disabled}
        style={{ minWidth: 12 }}
        color="primary"
        size="sm"
        className="text-3xl"
        variant="light">
        {icon}
      </Button>
    </Tooltip>
  );
};
