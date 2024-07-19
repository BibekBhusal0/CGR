import { FC, useContext, useMemo, useState } from "react";
import {
  CDCresponse,
  GameResponse,
  gamesOnChessDotCom,
  isGameResponse,
  player,
} from "../api/user";
import { Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { AppContext } from "../App";
import { Chess } from "chess.js";

interface PlayerProps {
  player_info: player;
}

interface TableProps {
  tableData: GameResponse;
}
export const GameTable: FC<TableProps> = ({ tableData: { games } }) => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }

  const { dispatch } = context;
  const handleClick = (pgn: string) => {
    const chess = new Chess();
    chess.loadPgn(pgn);
    dispatch({ type: "ChangeState", stage: "second", game: chess });
  };

  const rowsPerPage = 8;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(games.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return games.slice(start, end);
  }, [games, page]);
  return (
    <Table
      className="text-xl"
      removeWrapper
      aria-label="Game of selected month"
      selectionMode="single"
      bottomContent={
        <div className="flex f-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            onChange={setPage}
            total={pages}></Pagination>
        </div>
      }>
      <TableHeader>
        <TableColumn className="text-lg">Time Control</TableColumn>
        <TableColumn className="text-lg">White Player</TableColumn>
        <TableColumn className="text-lg"> </TableColumn>
        <TableColumn className="text-lg">Black Player</TableColumn>
      </TableHeader>
      <TableBody>
        {items.map((g, i) => (
          <TableRow key={i} onClick={() => handleClick(g.pgn)}>
            <TableCell className="text-lg">{g.time_control}</TableCell>
            <TableCell className="text-lg">
              <Player player_info={g.white} />
            </TableCell>
            <TableCell className="text-xl font-mono">VS</TableCell>
            <TableCell className="text-lg">
              <Player player_info={g.black} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Player: FC<PlayerProps> = ({ player_info: { username, rating } }) => {
  return (
    <span className="px-3 ">
      {username}({rating})
    </span>
  );
};

interface SelectGameProps {
  input: string;
}
export const SelectGame: FC<SelectGameProps> = ({ input }) => {
  const [data, setData] = useState<CDCresponse>();
  const [date, setDate] = useState(new Date());
  // const [loaded, setLoaded] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await gamesOnChessDotCom(
        input,
        date.getMonth(),
        date.getFullYear()
      );

      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        variant="shadow"
        color="primary"
        className="text-2xl py-8 font-semibold"
        isDisabled={input.trim() === ""}
        onPress={() => {
          onOpen();
          fetchData();
        }}>
        Choose Games
      </Button>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="text-center flex justify-center gap-3">
            Searched for game of {input} for {months[date.getMonth()]}{" "}
            {date.getFullYear()} in Chess.com
          </ModalHeader>
          <ModalBody>
            {data === undefined ? (
              "Couldn't fetch Data"
            ) : isGameResponse(data) ? (
              <GameTable tableData={data.data}></GameTable>
            ) : (
              `error occored while fetching ${JSON.stringify(data.data)}`
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
