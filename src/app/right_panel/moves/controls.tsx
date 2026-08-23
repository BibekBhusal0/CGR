import { ButtonGroup, ButtonProps } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { icons as all_icons } from "@/components/icons";
import { useGameState } from "@/Logic/state/game";
import { Buttons, newButtonProps } from "@/components/buttons";
const icons = all_icons.controls;

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

  const keyFunctionMapping: Record<string, () => void> = {
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

  const controlButtons: newButtonProps[] = [
    {
      tooltip: "Flip Board",
      onClick: () => flipBoard(),
      isDisabled: false,
      children: icons.flip,
    },
    {
      tooltip: "Starting Position",
      onClick: goToFirstMove,
      isDisabled: atStart,
      children: icons.first,
    },
    {
      tooltip: "Previous Move",
      onClick: goToPreviousMove,
      isDisabled: boardStage === "normal" ? atStart : linesAtStart,
      children: icons.previous,
    },
    {
      tooltip: pause ? "Play" : "Pause",
      onClick: togglePlayPause,
      isDisabled: boardStage === "normal" ? atEnd : linesAtEnd,
      children: pause ? icons.pause : icons.play,
    },
    {
      tooltip: "Next Move",
      onClick: goToNextMove,
      isDisabled: boardStage === "normal" ? atEnd : linesAtEnd,
      children: icons.next,
    },
    {
      tooltip: "Last Move",
      onClick: goToLastMove,
      isDisabled: atEnd,
      children: icons.last,
    },
    {
      tooltip: "Reset",
      onClick: () => changeState("first"),
      isDisabled: false,
      children: icons.reset,
    },
  ];
  const defaultButtonProps: ButtonProps = {
    isIconOnly: true,
    variant: "tertiary",
    size: "lg",
    className: "min-w-12 w-12",
  };

  return (
    <ButtonGroup variant={defaultButtonProps.variant}>
      <Buttons buttons={controlButtons} defaultProps={defaultButtonProps} includeSeperators />
    </ButtonGroup>
  );
}
