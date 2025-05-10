import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { useRef, useState } from "react";
import { SelectGame } from "./game_select";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "@/Logic/reducers/game";
import { CardBody } from "@heroui/card";
import { icons } from "@/components/icons";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/modal";
import { StateType } from "@/Logic/reducers/store";
import { allInputModes, inputModes, setInputMode } from "@/Logic/reducers/settings";

export function Input() {
  const [val, setVal] = useState("");
  const mode = useSelector((state: StateType) => state.settings.inputMode);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pgnRef = useRef<HTMLTextAreaElement>(null);

  function handleClick() {
    if (val.trim() !== "") {
      if (mode === "pgn") {
        const chess = new Chess();
        try {
          chess.loadPgn(val);
          dispatch(setGame(chess));
        } catch (error) {
          console.error(error);
          addToast({ title: "Please Enter Valid PGN", variant: "flat", color: "danger" });
        }
      } else onOpen();
    } else {
      addToast({
        title: mode === "pgn" ? "Please Enter Your  PGN" : "Please Enter username",
        variant: "flat",
        color: "danger",
      });
    }
  }

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
        onKeyDown={(e) => {
          if (e.key === "Enter" && mode !== "pgn") {
            handleClick();
          }
        }}
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
        size="lg"
        selectedKeys={[mode]}
        value={mode}
        classNames={{ trigger: "uppercase" }}
        onChange={(item) => {
          dispatch(setInputMode(item.target.value as inputModes));
          setVal("");
          pgnRef.current?.focus();
        }}>
        {allInputModes.map((item) => (
          <SelectItem key={item} children={item} className="uppercase" />
        ))}
      </Select>

      <Button
        className="w-full py-8 text-2xl font-semibold"
        variant="shadow"
        color="primary"
        startContent={
          <div
            className="text-4xl"
            children={mode === "pgn" ? icons.others.rocket : icons.others.search}
          />
        }
        onPress={handleClick}>
        {mode === "pgn" ? "Analyze" : "Search"}
      </Button>
      <SelectGame {...{ input: val, onOpenChange, isOpen }} />
    </CardBody>
  );
}
