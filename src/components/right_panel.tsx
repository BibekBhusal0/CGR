import {
  Button,
  ButtonGroup,
  Card,
  Chip,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useContext, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { PiDeviceRotateBold } from "react-icons/pi";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChessQueen,
  FaForward,
  FaPlay,
  FaStepBackward,
} from "react-icons/fa";
import { AppContext } from "../App";

function RightPanel() {
  return (
    <div className="basis-4/12 px-2 relative">
      <Card className=" p-3">
        <Chip size="lg" color="primary" className="px-8 py-8 mt-6 mb-12">
          <div className="flex gap-4 text-center text-3xl font-semibold">
            <IoSearch /> Chess Game Review
          </div>
        </Chip>
        <Input />
      </Card>
      <Controls />
    </div>
  );
}

function Input() {
  const [mode, setMode] = useState<string>("chess");
  const [val, setVal] = useState("");
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const { dispatch } = context;
  const handleClick = () => {
    if (val.trim() !== "") {
      const stage = mode === "chess" ? "second" : "third";
      dispatch({ type: "ChangeState", stage, more: val });
    }
  };
  const pgnRef = useRef<any>(null);
  return (
    <>
      <Textarea
        aria-label="pgn"
        className="basis-8/12"
        value={val}
        onValueChange={setVal}
        ref={pgnRef}
        label={mode === "pgn" ? "Paste PGN" : "Chess.com Username"}
        minRows={mode === "pgn" ? 4 : 1}
        maxRows={mode === "pgn" ? 15 : 1}></Textarea>
      <Select
        aria-label="type"
        className="basis-4/12 my-7"
        defaultSelectedKeys={[mode]}
        isDisabled
        value={mode}
        onChange={(item) => {
          setMode(item.target.value);
          setVal("");
          pgnRef.current.focus();
        }}>
        <SelectItem key="chess">Chess.com</SelectItem>
        <SelectItem key="pgn">PGN</SelectItem>
      </Select>
      <Button
        className="font-semibold text-2xl py-8 group"
        color="primary"
        onPress={handleClick}
        variant="ghost">
        <div className="flex gap-5 group-hover:scale-125 transition-size">
          <FaChessQueen className="text-3xl font-semibold transition-transform group-hover:rotate-6 group-hover:translate-x-2 group-hover:-translate-y-2" />
          Analize
        </div>
      </Button>
    </>
  );
}

function Controls() {
  const names = [
    "Flip Borad",
    "First Move",
    "Previous Move",
    "Play",
    "Next Move",
    "Last Move",
  ];
  const icons = [
    <PiDeviceRotateBold />,
    <FaStepBackward />,
    <FaArrowLeft />,
    <FaPlay />,
    <FaArrowRight />,
    <FaForward />,
  ];
  // const clickHandlers = []

  return (
    <Card className={`mx-auto absolute bottom-2 `}>
      <ButtonGroup>
        {names.map((name, i) => (
          <Tooltip color="primary" showArrow={true} key={i} content={name}>
            <Button
              color="primary"
              size="sm"
              className="text-xl px-4 py-8"
              variant="light">
              {icons[i]}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
    </Card>
  );
}

export const grid = [
  "grid-cols-4",
  "grid-cols-5",
  "grid-cols-6",
  "grid-cols-7",
  "grid-cols-8",
  "grid-cols-9",
  "grid-cols-10",
  "grid-cols-11",
  "grid-cols-12",
];
export default RightPanel;
