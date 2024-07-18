import { FC, useContext, useEffect, useState } from "react";
import {
  CDCresponse,
  game,
  gamesOnChessDotCom,
  isGameResponse,
  player,
} from "../api/user";
import { Card, Chip } from "@nextui-org/react";
import { AppContext } from "../App";

const GameSelect: FC = () => {
  console.log("Game selection");
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("context not found");
  }
  const {
    state: { userName },
  } = context;

  const [data, setData] = useState<CDCresponse>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = new Date();
        const response = await gamesOnChessDotCom(
          userName,
          date.getMonth(),
          date.getFullYear()
        );
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="absolute w-full z-20 ">
      <div className="mx-auto w-4/5 h-20">
        <Card className="p-10 overflow-y-scroll h-30 overflow-x-scroll">
          {data === undefined
            ? "Couldn't fetch data"
            : isGameResponse(data)
            ? data.data.games.map((g) => <GameCard game_info={g} />)
            : "No games available or an error occurred"}
        </Card>
      </div>
    </div>
  );
};

interface GameCardProps {
  game_info: game;
}
interface PlayerProps {
  player_info: player;
}
const GameCard: FC<GameCardProps> = ({
  game_info: { white, black, time_control },
}) => {
  return (
    <Chip variant="faded" size="lg">
      {time_control}
      <Player player_info={white} />
      vs
      <Player player_info={black} />
    </Chip>
  );
};

const Player: FC<PlayerProps> = ({ player_info: { username, rating } }) => {
  console.log();
  return (
    <span className="px-3">
      {username}
      {rating}
    </span>
  );
};

export default GameSelect;
