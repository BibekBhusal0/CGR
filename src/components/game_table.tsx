import { FC, useContext, useMemo, useState } from "react";
import {
  drawResults,
  game,
  GameResponse,
  lostResults,
  player,
} from "../api/CDC";
import { Skeleton } from "@nextui-org/skeleton";
import { Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { AppContext } from "../App";
import { Chess } from "chess.js";
import TimeControl from "./timeControls";

const titles = ["Time Control", "White Player", "", "Balck Player"];

interface TableProps {
  tableData: GameResponse;
  userName: string;
}
const rowsPerPage = 8;
export const GameTable: FC<TableProps> = ({
  tableData: { games },
  userName,
}) => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }

  const { dispatch } = context;
  const handleClick = (game: game) => {
    const { black, pgn, initial_setup } = game;
    const chess = new Chess(initial_setup);
    chess.loadPgn(pgn);
    if (black.username === userName) {
      dispatch({ type: "FlipBoard" });
    }
    dispatch({ type: "SetGame", game: chess });
    dispatch({ type: "ChangeState", stage: "second" });
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
  const notSupported = items.filter(
    ({ rules }) => !(rules === "chess" || rules === "chess960")
  );
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
        emptyContent={`${userName} has not palyed any games this month you can try diffent month`}>
        {items.map((g) => (
          <TableRow
            key={g.uuid}
            className={getColors(g)}
            onClick={() => handleClick(g)}>
            <TableCell className="text-lg">
              <TimeControl control={g.time_class} />
            </TableCell>
            <TableCell>
              <Player player_info={g.white} />
            </TableCell>
            <TableCell className="text-2xl font-mono">VS</TableCell>
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
      aria-label="loaidng table"
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
                <Skeleton className="p-3 rounded-sm" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
