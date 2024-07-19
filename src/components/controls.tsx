import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { PiDeviceRotateBold } from "react-icons/pi";
import {
  FaArrowLeft,
  FaArrowRight,
  FaForward,
  FaPlay,
  FaStepBackward,
} from "react-icons/fa";
import { FC, useContext } from "react";
import { AppContext } from "../App";

interface TTButtonProps {
  name: string;
  clickHandler: () => void;
  disabled: boolean;
  icon: JSX.Element;
}

export function Controls() {
  const context = useContext(AppContext);
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

  const controlButtons: TTButtonProps[] = [
    {
      name: "Flip Board",
      clickHandler: () => dispatch({ type: "FlipBoard" }),
      disabled: false,
      icon: <PiDeviceRotateBold className="rotate-90 text-3xl" />,
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
      disabled: moveIndex === 0,
      icon: <FaArrowLeft />,
    },
    {
      name: "Play",
      clickHandler: () => {},
      disabled: true,
      icon: <FaPlay />,
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
      icon: <FaForward />,
    },
  ];

  return (
    <>
      <ButtonGroup>
        {controlButtons.map((BP) => (
          <TTButton key={BP.name} {...BP} />
        ))}
      </ButtonGroup>
    </>
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
        color="primary"
        size="sm"
        className="text-xl px-4 py-8"
        variant="light">
        {icon}
      </Button>
    </Tooltip>
  );
};
