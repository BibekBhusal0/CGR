import {
  Button,
  Chip,
  ListBox,
  Select,
  toast,
  useOverlayState,
  TextArea,
  Card,
  TextField,
  Label,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { SelectGame } from "@/app/right_panel/input/game_select";
import { Chess } from "chess.js";
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
    <Card.Content className="flex-center flex-col gap-7 px-3 py-5">
      <Chip size="lg" variant="primary" color="accent" className="gap-3 rounded-full p-4 text-xl">
        <div className="text-2xl" children={icons.chess.rook_pawn} />
        Chess Game Review
      </Chip>

      <Select
        fullWidth
        aria-label="type"
        placeholder="How do you want to import game"
        variant="secondary"
        value={mode}
        onChange={(item) => {
          setInputMode(item as inputModes);
          setVal("");
          pgnRef.current?.focus();
        }}>
        <Select.Trigger className="uppercase">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allInputModes.map((item) => (
              <ListBox.Item
                key={item}
                id={item}
                textValue={item}
                children={item}
                className="uppercase"
              />
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField fullWidth>
        <Label>{mode === "pgn" ? "Paste PGN" : "Chess.com Username"}</Label>
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
          rows={mode === "pgn" ? 8 : 1}
          style={{ resize: "none" }}
          variant="secondary"
          fullWidth
        />
      </TextField>

      <Button
        className="w-full py-3 font-semibold"
        variant="primary"
        size="lg"
        onClick={handleClick}>
        <div
          className="text-2xl"
          children={mode === "pgn" ? icons.others.rocket : icons.others.search}
        />
        {mode === "pgn" ? "Analyze" : "Search"}
      </Button>
      <SelectGame {...{ input: val, toggle, isOpen }} />
    </Card.Content>
  );
}
