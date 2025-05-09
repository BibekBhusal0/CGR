import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { useRef, useState } from "react";
import { SelectGame } from "./game_select";
import { Chess } from "chess.js";
import { useDispatch } from "react-redux";
import { changeState, setGame } from "@/Logic/reducers/game";
import { CardBody } from "@heroui/card";
import { icons } from "@/components/icons";
import { addToast, } from "@heroui/toast";

export function Input() {
  const [mode, setMode] = useState<string>("chess");
  const [val, setVal] = useState("");
  const dispatch = useDispatch();

  function handleClick() {
    if (val.trim() !== "") {
      const chess = new Chess();
      try {
        chess.loadPgn(val);
        dispatch(setGame(chess));
        dispatch(changeState("second"));
      } catch (error) {
        addToast({ title: "Please Enter Valid PGN", variant: 'flat', color: 'danger' });
      }
    } else {
      addToast({ title: "Please Enter Your  PGN", variant: 'flat', color: 'danger' });
    }
  }

  const pgnRef = useRef<HTMLTextAreaElement>(null);

  return (
    <CardBody className="flex-center flex-col gap-7 px-3 py-5">
      <Chip
        size="lg"
        startContent={<div className="text-4xl" children={icons.chess.rook_pawn} />}
        color="primary"
        className="gap-3 p-8 text-2xl">
        <div>Chess Game Review</div>
      </Chip>
      <Textarea
        aria-label="pgn"
        value={val}
        onValueChange={(e) => {
          setVal(e);
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
            pgnRef.current?.focus();
          }
        }}>
        <SelectItem key="chess">Chess.com</SelectItem>
        <SelectItem key="pgn">PGN</SelectItem>
      </Select>
      {mode === "pgn" ? (
        <Button
          className="w-full py-8 text-2xl font-semibold"
          variant="shadow"
          color="primary"
          endContent={<div className="text-4xl" children={icons.others.rocket} />}
          onPress={handleClick}>
          Analyze
        </Button>
      ) : (
        <SelectGame input={val} />
      )}
    </CardBody>
  );
}
