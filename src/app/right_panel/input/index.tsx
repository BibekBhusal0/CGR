import { Button, Chip, ListBox, Select, toast, useOverlayState, TextArea } from "@heroui/react";
// import { Chip } from "@heroui/chip";
// import { Select, SelectItem } from "@heroui/select";
// import { Textarea } from "@heroui/input";
import { useEffect, useRef, useState } from "react";
import { SelectGame } from "@/app/right_panel/input/game_select";
import { Chess } from "chess.js";
import { CardBody } from "@heroui/card";
import { icons } from "@/components/icons";
import { useSettingsState } from "@/Logic/state/settings";
import { useGameState } from "@/Logic/state/game";
import { allInputModes, inputModes } from "@/Logic/state/settings";

export function Input() {
  const mode = useSettingsState((state) => state.inputMode);
  const setGame = useGameState((state) => state.setGame);
  const [val, setVal] = useState("");
  const setInputMode = useSettingsState((state) => state.setInputMode);
  const setBottom = useGameState((state) => state.setBottom);

  const { isOpen, open, toggle } = useOverlayState();
  const pgnRef = useRef<HTMLTextAreaElement>(null);

  function analyzePgn(pgn: string) {
    const chess = new Chess();
    try {
      chess.loadPgn(pgn);
      setGame(chess);
    } catch (error) {
      console.error(error);
      toast.danger("Please Enter Valid PGN");
    }
  }

  function handleClick() {
    if (val.trim() !== "") {
      if (mode === "pgn") analyzePgn(val.trim());
      else open();
    } else {
      toast.danger(mode === "pgn" ? "Please Enter Your  PGN" : "Please Enter username");
    }
  }

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const clear = () => {
      currentUrl.search = "";
      window.history.replaceState({}, document.title, currentUrl.toString());
    };
    const pgn = currentUrl.searchParams.get("pgn");
    const orientation = currentUrl.searchParams.get("orientation");
    if (orientation && (orientation === "black" || orientation === "white")) {
      setBottom(orientation);
    }

    if (pgn) {
      setInputMode("pgn");
      if (currentUrl.searchParams.get("analyze") === "true") {
        analyzePgn(pgn || "");
      } else
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVal(pgn || "");
      clear();
    } else if (currentUrl.searchParams.get("cdcUsername")) {
      setInputMode("chess.com");
      setVal(currentUrl.searchParams.get("cdcUsername") || "");
      if (currentUrl.searchParams.get("search") === "true") {
        open();
      }
      clear();
    }
    return clear;
  }, []);

  return (
    <CardBody className="flex-center flex-col gap-7 px-3 py-5">
      <Chip
        size="lg"
        // startContent={<div className="text-4xl" children={icons.chess.rook_pawn} />}
        // color="primary"
        className="gap-3 p-8 text-2xl">
        <div>Chess Game Review</div>
      </Chip>

      <TextArea
        aria-label="pgn"
        onKeyDown={(e) => {
          if (e.key === "Enter" && mode !== "pgn") {
            handleClick();
          }
        }}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        ref={pgnRef}
        // label={mode === "pgn" ? "Paste PGN" : "Chess.com Username"}
        // minRows={mode === "pgn" ? 8 : 1}
        // maxRows={mode === "pgn" ? 10 : 1}
      />

      <Select
        aria-label="type"
        // size="lg"
        // selectedKeys={[mode]}
        value={mode}
        // classNames={{ trigger: "uppercase" }}
        onChange={(item) => {
          setInputMode(item as inputModes);
          setVal("");
          pgnRef.current?.focus();
        }}>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allInputModes.map((item) => (
              <ListBox.Item key={item} children={item} className="uppercase" />
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Button
        className="w-full py-8 text-2xl font-semibold"
        // variant="shadow"
        // color="primary"
        // startContent={
        //   <div
        //     className="text-4xl"
        //     children={mode === "pgn" ? icons.others.rocket : icons.others.search}
        //   />
        // }
        onPress={handleClick}>
        {mode === "pgn" ? "Analyze" : "Search"}
      </Button>
      <SelectGame {...{ input: val, toggle, isOpen }} />
    </CardBody>
  );
}
