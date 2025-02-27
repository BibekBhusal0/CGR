import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { useRef, useState } from "react";
import { FaChessQueen } from "react-icons/fa";
import { SelectGame } from "./game_select";
import { Chess } from "chess.js";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { changeState, setGame } from "@/Logic/reducers/game";
import { CardBody } from "@heroui/card";

export function Input() {
  const [mode, setMode] = useState<string>("chess");
  const [val, setVal] = useState("");
  const [massage, setMassage] = useState("");
  const dispatch = useDispatch();

  function handleClick() {
    if (val.trim() !== "") {
      const chess = new Chess();
      try {
        chess.loadPgn(val);
        dispatch(setGame(chess));
        dispatch(changeState("second"));
      } catch (error) {
        setMassage("Please Enter Valid PGN");
      }
    } else {
      setMassage("Please Enter Your  PGN");
    }
  }

  const pgnRef = useRef<any>(null);
  return (
    <CardBody className="flex-center flex-col gap-7 px-3 py-5">
      <Chip
        size="lg"
        startContent={<IoSearch className="text-4xl" />}
        color="primary"
        className="text-2xl p-8 gap-3">
        <div>Chess Game Review</div>
      </Chip>
      <Textarea
        aria-label="pgn"
        value={val}
        onValueChange={(e) => {
          setVal(e);
          if (val.trim() !== "") setMassage("");
        }}
        ref={pgnRef}
        label={mode === "pgn" ? "Paste PGN" : "Chess.com Username"}
        minRows={mode === "pgn" ? 8 : 1}
        maxRows={mode === "pgn" ? 10 : 1}
      />
      <Select
        aria-label="type"
        defaultSelectedKeys={[mode]}
        value={mode}
        onChange={(item) => {
          if (item.target.value.trim() !== "") {
            setMode(item.target.value);
            setVal("");
            pgnRef.current.focus();
          }
        }}>
        <SelectItem key="chess">Chess.com</SelectItem>
        <SelectItem key="pgn">PGN</SelectItem>
      </Select>
      {mode === "pgn" ? (
        <Button
          className="text-2xl font-semibold w-full py-8"
          variant="shadow"
          color="primary"
          startContent={<FaChessQueen className="text-3xl" />}
          onPress={handleClick}>
          Analyze
        </Button>
      ) : (
        <SelectGame input={val} />
      )}
      {massage && <div className="text-xl py-2 text-danger">{massage}</div>}
    </CardBody>
  );
}
