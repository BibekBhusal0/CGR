import { FC, useMemo, useState } from "react";
import { drawResults, game, GameResponse, lostResults, player } from "@/api/CDC";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import TimeControl from "@/components/timeControls";
import { useGameState } from "@/Logic/state/game";

const titles = ["Time Control", "White Player", "", "Black Player"];

interface TableProps {
  tableData: GameResponse;
  userName: string;
}
const rowsPerPage = 8;
export const GameTable: FC<TableProps> = ({ tableData: { games }, userName }) => {
  const loadFromCdc = useGameState((state) => state.loadFromCdc);
  const handleClick = (game: game) => loadFromCdc(game, userName);

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
        td: ["text-md flex-none first:hidden first:md:block first:md:py-2.5"],
        tr: ["max-h-10 flex-none"],
        th: [
          "text-sm flex-none first:hidden first:md:block first:md:py-2.5 nth-[2]:rounded-l-lg nth-[2]:md:rounded-l-none text-center",
        ],
        table: ["min-h-[400px]"],
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
            <TableCell className="text-lg m-0 p-0 h-11">
              <TimeControl control={g.time_class} />
            </TableCell>
            <TableCell>
              <Player player_info={g.white} />
            </TableCell>
            <TableCell className="font-mono text-lg">VS</TableCell>
            <TableCell className="m-0 p-0 h-8">
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
    <span className="flex ">
      <div className="max-w-[60%] truncate">{username}</div> ({rating})
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
