import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
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
import { FC, useContext, useEffect, useState } from "react";
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
  if (!context) {
    throw new Error();
  }

  const {
    state: { moveIndex, Game },
    dispatch,
  } = context;
  if (!Game) {
    throw new Error();
  }
  const n_moves = Game.history().length;

  useEffect(() => {
    if (moveIndex === n_moves - 1) {
      setPause(false);
    }
    if (pause && moveIndex < n_moves - 1) {
      const crrMove = setInterval(() => {
        dispatch({ type: "SetIndex", index: moveIndex + 1 });
      }, 500);

      return () => clearInterval(crrMove);
    }
  }, [pause, moveIndex, n_moves, dispatch]);
  const controlButtons: TTButtonProps[] = [
    {
      name: "Flip Board",
      clickHandler: () => dispatch({ type: "FlipBoard" }),
      disabled: false,
      icon: <PiDeviceRotateBold className="rotate-90 text-2xl" />,
    },
    {
      name: "Starting Position",
      clickHandler: () => dispatch({ type: "SetIndex", index: -1 }),
      disabled: moveIndex === -1,
      icon: <FaStepBackward />,
    },
    {
      name: "Previous Move",
      clickHandler: () => dispatch({ type: "SetIndex", index: moveIndex - 1 }),
      disabled: moveIndex === -1,
      icon: <FaArrowLeft />,
    },
    {
      name: "Play",
      clickHandler: () => {
        setPause((prevPause) => !prevPause);
      },
      disabled: moveIndex === n_moves - 1,
      icon: pause ? <FaPause /> : <FaPlay />,
    },
    {
      name: "Next Move",
      clickHandler: () => dispatch({ type: "SetIndex", index: moveIndex + 1 }),
      disabled: moveIndex === n_moves - 1,
      icon: <FaArrowRight />,
    },
    {
      name: "Last Move",
      clickHandler: () => dispatch({ type: "SetIndex", index: n_moves - 1 }),
      disabled: moveIndex === n_moves - 1,
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
