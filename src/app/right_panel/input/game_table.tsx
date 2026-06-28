import { FC, useMemo, useState } from "react";
import { drawResults, game, GameResponse, lostResults, player } from "@/api/CDC";
import { Skeleton, Pagination, Table, EmptyState, TableColumn, cn } from "@heroui/react";
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
    <Table aria-label="Game of selected month">
      <Table.ScrollContainer>
        <Table.Content
          selectionMode="single"
          onSelectionChange={(d) => {
            let game: game;
            if (d === "all") game = games[0];
            else {
              const id = d.values().next().value;
              const _game = games.find((g) => g.uuid === id);
              if (!_game) return;
              game = _game;
            }
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
                key={g.uuid}
                id={g.uuid}
                isDisabled={disabledKeys.includes(g.uuid)}
                className="max-h-10 flex-none cursor-pointer">
                <Table.Cell className="m-0 h-11 p-0 text-lg">
                  <TimeControl control={g.time_class} />
                </Table.Cell>
                <Table.Cell className={getColors(g)}>
                  <Player player_info={g.white} />
                </Table.Cell>
                <Table.Cell className={cn("font-mono text-lg", getColors(g))}>VS</Table.Cell>
                <Table.Cell className={cn("m-0 h-8 p-0", getColors(g))}>
                  <Player player_info={g.black} />
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

interface PlayerProps {
  player_info: player;
}
const Player: FC<PlayerProps> = ({ player_info: { username, rating } }) => {
  return (
    <span className="flex">
      <div className="max-w-[60%] truncate">{username}</div> ({rating})
    </span>
  );
};

export const LoadingTable: FC = () => {
  return (
    <Table
      aria-label="loading table"
      // selectionMode="none"
      // classNames={{
      //   td: ["text-xl"],
      //   th: ["text-lg"],
      // }}
    >
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            {titles.map((t) => (
              <TableColumn key={t}>{t}</TableColumn>
            ))}
          </Table.Header>
          <Table.Body>
            {[...Array(rowsPerPage)].map((_, i) => (
              <Table.Row key={i}>
                {[...Array(4)].map((_, j) => (
                  <Table.Cell key={`${i}_${j}`}>
                    <Skeleton className="rounded-xs p-3" />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
