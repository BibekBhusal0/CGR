import { FC, useMemo, useState } from "react";
import { LichessGame, lichessSpeedToTimeControl } from "@/api/lichess";
import { Pagination, Table, EmptyState, cn } from "@heroui/react";
import TimeControl from "@/components/timeControls";
import { useGameState } from "@/Logic/state/game";

const titles = ["Time Control", "White Player", "", "Black Player"];

interface LichessTableProps {
  games: LichessGame[];
  userName: string;
}

const rowsPerPage = 8;

function getPlayerName(game: LichessGame, color: "white" | "black"): string {
  const p = game.players[color];
  return p.user?.name ?? (p.aiLevel !== undefined ? `Stockfish ${p.aiLevel}` : "?");
}

function getPlayerRating(game: LichessGame, color: "white" | "black"): string {
  const r = game.players[color].rating;
  return r !== undefined ? ` (${r})` : "";
}

export const LichessGameTable: FC<LichessTableProps> = ({ games, userName }) => {
  const loadFromLichess = useGameState((state) => state.loadFromLichess);
  const handleClick = (game: LichessGame) => loadFromLichess(game, userName);

  const lowerUser = userName.trim().toLowerCase();
  const getColors = (game: LichessGame): string => {
    const userColor = game.players.black.user?.name.toLowerCase() === lowerUser ? "black" : "white";
    if (!game.winner) return "text-warning";
    return game.winner === userColor ? "text-success" : "text-danger";
  };

  const [page, setPage] = useState(1);
  const pages = Math.ceil(games.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return games.slice().reverse().slice(start, end);
  }, [games, page]);
  const notSupported = items.filter(
    ({ variant }) =>
      !(variant === "standard" || variant === "chess960" || variant === "fromPosition")
  );
  const disabledKeys = new Set(notSupported.map(({ id }) => id));

  return (
    <Table aria-label="Lichess games of selected month">
      <Table.ScrollContainer>
        <Table.Content
          selectionMode="single"
          onSelectionChange={(d) => {
            let game: LichessGame | undefined;
            if (d === "all") game = games[0];
            else {
              const id = d.values().next().value;
              game = games.find((g) => g.id === id);
            }
            if (!game) return;
            handleClick(game);
          }}>
          <Table.Header>
            {titles.map((t) => (
              <Table.Column isRowHeader={t === "Time Control"} key={t}>
                {t}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <EmptyState className="text-md py-5 text-center">
                {userName} has not played any games this month you can try different month
              </EmptyState>
            )}>
            {items.map((g) => (
              <Table.Row
                key={g.id}
                id={g.id}
                isDisabled={disabledKeys.has(g.id)}
                className="max-h-10 flex-none cursor-pointer">
                <Table.Cell className="m-0 h-11 p-0 text-lg">
                  <TimeControl control={lichessSpeedToTimeControl(g.speed)} />
                </Table.Cell>
                <Table.Cell className={getColors(g)}>
                  <span className="flex">
                    <div className="max-w-[60%] truncate">{getPlayerName(g, "white")}</div>
                    {getPlayerRating(g, "white")}
                  </span>
                </Table.Cell>
                <Table.Cell className={cn("font-mono text-lg", getColors(g))}>VS</Table.Cell>
                <Table.Cell className={cn("m-0 h-8 p-0", getColors(g))}>
                  <span className="flex">
                    <div className="max-w-[60%] truncate">{getPlayerName(g, "black")}</div>
                    {getPlayerRating(g, "black")}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {!(pages === 1 || pages === 0) && (
        <Table.Footer className="flex-center">
          <Pagination className="w-auto" size="sm">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    className="bg-accent-soft hover:bg-accent-soft-hover data-[active=true]:bg-accent data-[active=true]:hover:bg-accent-hover"
                    isActive={p === page}
                    onPress={() => setPage(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next isDisabled={page === pages} onPress={() => setPage((p) => p + 1)}>
                  <span>Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      )}
    </Table>
  );
};
