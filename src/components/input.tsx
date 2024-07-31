import { Button, Chip, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useContext, useRef, useState } from "react";
import { FaChessQueen } from "react-icons/fa";
import { AppContext } from "../App";
import { SelectGame } from "./game_select";
import { Chess } from "chess.js";
import { IoSearch } from "react-icons/io5";

export function Input() {
  const [mode, setMode] = useState<string>("chess");
  const [val, setVal] = useState("");
  const [massage, setMassage] = useState("");

  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const { dispatch } = context;
  function handleClick() {
    if (val.trim() !== "") {
      const chess = new Chess();
      try {
        chess.loadPgn(val);
        dispatch({ type: "SetGame", game: chess });
        dispatch({ type: "ChangeState", stage: "second" });
      } catch (error) {
        setMassage("Please Enter Valid PGN");
      }
    } else {
      setMassage("Please Enter Your  PGN");
    }
  }

  const pgnRef = useRef<any>(null);
  return (
    <div className=" flex flex-col gap-7 px-3">
      <Chip size="lg" color="primary" className="px-8 py-8 mt-6 mb-5">
        <div className="flex gap-4 text-center text-3xl font-semibold">
          <IoSearch /> Chess Game Review
        </div>
      </Chip>
      <Textarea
        aria-label="pgn"
        value={val}
        onValueChange={(e) => {
          setVal(e);
          if (val.trim() !== "") {
            setMassage("");
          }
        }}
        ref={pgnRef}
        label={mode === "pgn" ? "Paste PGN" : "Chess.com Username"}
        minRows={mode === "pgn" ? 8 : 1}
        maxRows={mode === "pgn" ? 10 : 1}></Textarea>
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
          className="text-2xl py-8 font-semibold group "
          variant="shadow"
          color="primary"
          onPress={handleClick}>
          <div className="flex gap-5 transition-size">
            <FaChessQueen className="text-3xl transition-transform group-hover:rotate-6 group-hover:translate-x-2 group-hover:-translate-y-2" />
            Analize
          </div>
        </Button>
      ) : (
        <SelectGame input={val} />
      )}
      <div className="text-xl">{massage}</div>
    </div>
  );
}
