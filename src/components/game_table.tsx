import { FC, useMemo, useState } from "react";
import { chessResults, drawResults, game, GameResponse, lostResults, player } from "../api/CDC";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Chess, DEFAULT_POSITION } from "chess.js";
import TimeControl from "./timeControls";
import {
  changeState,
  flipBoard,
  setGame,
  setTermination,
  terminationType,
} from "../Logic/reducers/game";
import { GOT } from "./moveTypes";
import { useDispatch } from "react-redux";

const titles = ["Time Control", "White Player", "", "Black Player"];

function reformatLostResult(result: chessResults): GOT {
  if (result === "checkmated" || result === "timeout" || result === "resigned") {
    return result;
  }
  if (result === "abandoned") return "resigned";
  return "checkmated";
}

interface TableProps {
  tableData: GameResponse;
  userName: string;
}
const rowsPerPage = 8;
export const GameTable: FC<TableProps> = ({ tableData: { games }, userName }) => {
  const dispatch = useDispatch();
  const handleClick = (game: game) => {
    const { black, pgn, initial_setup, white } = game;
    const chess = new Chess(initial_setup || DEFAULT_POSITION);
    chess.loadPgn(pgn);
    if (black.username === userName) dispatch(flipBoard());
    var termination: terminationType | undefined;
    if (drawResults.includes(black.result)) {
      termination = { overBy: "draw", winner: undefined };
    } else if (black.result === "win") {
      termination = { winner: "b", overBy: reformatLostResult(white.result) };
    } else if (white.result === "win") {
      termination = { winner: "w", overBy: reformatLostResult(black.result) };
    }
    dispatch(setTermination(termination));
    dispatch(setGame(chess));
    dispatch(changeState("second"));
  };

  const getColors: (game: game) => string = (game) => {
    const user = game.black.username === userName ? game.black : game.white;
    const { result } = user;
    if (drawResults.includes(result)) {
      return "text-warning";
    } else if (lostResults.includes(result)) {
      return "text-danger";
    } else {
      return "text-success";
    }
  };

  const [page, setPage] = useState(1);
  const pages = Math.ceil(games.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return games.slice().reverse().slice(start, end);
  }, [games, page]);
  const notSupported = items.filter(({ rules }) => !(rules === "chess" || rules === "chess960"));
  const disabledKeys = notSupported.map(({ uuid }) => uuid);
  return (
    <Table
      classNames={{
        td: ["text-xl"],
        th: ["text-lg"],
      }}
      aria-label="Game of selected month"
      selectionMode="single"
      disabledKeys={disabledKeys}
      disabledBehavior="all"
      bottomContentPlacement="outside"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            loop
            siblings={2}
            variant="bordered"
            showControls
            showShadow
            page={page}
            onChange={setPage}
            total={pages}></Pagination>
        </div>
      }>
      <TableHeader>
        {titles.map((t) => (
          <TableColumn key={t}>{t}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={`${userName} has not played any games this month you can try different month`}>
        {items.map((g) => (
          <TableRow key={g.uuid} className={getColors(g)} onClick={() => handleClick(g)}>
            <TableCell className="text-lg">
              <TimeControl control={g.time_class} />
            </TableCell>
            <TableCell>
              <Player player_info={g.white} />
            </TableCell>
            <TableCell className="font-mono text-2xl">VS</TableCell>
            <TableCell>
              <Player player_info={g.black} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface PlayerProps {
  player_info: player;
}
const Player: FC<PlayerProps> = ({ player_info: { username, rating } }) => {
  return (
    <span className="px-3">
      {username} ({rating})
    </span>
  );
};

export const LoadingTable: FC = () => {
  return (
    <Table
      aria-label="loading table"
      selectionMode="none"
      classNames={{
        td: ["text-xl"],
        th: ["text-lg"],
      }}>
      <TableHeader>
        {titles.map((t) => (
          <TableColumn key={t}>{t}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {[...Array(rowsPerPage)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(4)].map((_, j) => (
              <TableCell key={`${i}_${j}`}>
                <Skeleton className="rounded-xs p-3" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
