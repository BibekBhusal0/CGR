import {
  Button,
  Chip,
  ListBox,
  Select,
  toast,
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
import { getLichessGameById, isSingleLichessGameResponse } from "@/api/lichess";
import { parseGameLink } from "@/api/gameLink";

export function Input() {
  const mode = useSettingsState((state) => state.inputMode);
  const setGame = useGameState((state) => state.setGame);
  const loadFromLichess = useGameState((state) => state.loadFromLichess);
  const [val, setVal] = useState("");
  const [fetching, setFetching] = useState(false);
  const setInputMode = useSettingsState((state) => state.setInputMode);
  const setBottom = useGameState((state) => state.setBottom);

  const [isOpen, onOpenChange] = useState(false);
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

  async function fetchLichessGame(id: string, fallbackAsUsername: boolean) {
    setFetching(true);
    try {
      const response = await getLichessGameById(id);
      if (isSingleLichessGameResponse(response)) {
        loadFromLichess(response.data);
        toast.success("Game loaded");
      } else if (response.status === 404 && fallbackAsUsername) {
        toast.warning("Not a valid game ID, searching as username instead");
        onOpenChange(true);
      } else {
        toast.danger("Couldn't fetch game, check the link or ID and try again");
      }
    } catch (error) {
      console.error(error);
      toast.danger("Couldn't fetch game, check your connection and try again");
    } finally {
      setFetching(false);
    }
  }

  function handleClick() {
    if (val.trim() === "") {
      toast.danger(mode === "pgn" ? "Please Enter Your  PGN" : "Please Enter username");
      return;
    }
    if (mode === "pgn") {
      analyzePgn(val.trim());
      return;
    }
    const parsed = parseGameLink(val);
    if (parsed?.platform === "lichess") {
      if (mode !== "lichess") setInputMode("lichess");
      void fetchLichessGame(parsed.id, true);
      return;
    }
    if (parsed?.platform === "chess.com") {
      toast.warning("Chess.com has no single-game API, search by username instead");
      return;
    }
    onOpenChange(true);
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
        onOpenChange(true);
      }
      clear();
    } else if (currentUrl.searchParams.get("lichessUsername")) {
      setInputMode("lichess");
      setVal(currentUrl.searchParams.get("lichessUsername") || "");
      if (currentUrl.searchParams.get("search") === "true") {
        onOpenChange(true);
      }
      clear();
    } else if (currentUrl.searchParams.get("lichessId") || currentUrl.searchParams.get("gameUrl")) {
      const raw =
        currentUrl.searchParams.get("lichessId") || currentUrl.searchParams.get("gameUrl") || "";
      const parsed = parseGameLink(raw);
      clear();
      if (parsed?.platform === "lichess") {
        setInputMode("lichess");
        setVal(raw);
        void fetchLichessGame(parsed.id, false);
      } else if (parsed?.platform === "chess.com") {
        toast.warning("Chess.com has no single-game API, search by username instead");
      } else {
        toast.danger("Couldn't find a game ID in the link");
      }
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
          setTimeout(() => pgnRef.current?.focus(), 1);
        }}>
        <Select.Trigger className="uppercase">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allInputModes.map((item) => (
              <ListBox.Item key={item} id={item} textValue={item} className="uppercase">
                {item}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField fullWidth>
        <Label>
          {mode === "pgn"
            ? "Paste PGN"
            : mode === "lichess"
              ? "Lichess Username, Game URL or ID"
              : "Chess.com Username"}
        </Label>
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
        isDisabled={fetching}
        onPress={handleClick}>
        <div
          className="text-2xl"
          children={mode === "pgn" ? icons.others.rocket : icons.others.search}
        />
        {fetching ? "Loading..." : mode === "pgn" ? "Analyze" : "Search"}
      </Button>
      <SelectGame {...{ input: val, isOpen, onOpenChange }} />
    </Card.Content>
  );
}
