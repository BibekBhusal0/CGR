import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { CDCresponse, getGamesOfPlayer, isGameResponse } from "@/api/CDC";
import {
  LichessResponse,
  getLichessGamesOfPlayer,
  isLichessGamesResponse,
} from "@/api/lichess";
import { Modal } from "@heroui/react";
import { GameTable, LoadingTable } from "@/app/right_panel/input/game_table";
import { LichessGameTable } from "@/app/right_panel/input/lichess_game_table";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useSettingsState } from "@/Logic/state/settings";
import ChooseMonth from "@/components/chooseMonth";

type SelectGameProps = {
  input: string;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

export const SelectGame: FC<SelectGameProps> = ({ input, onOpenChange, isOpen }) => {
  const inputMode = useSettingsState((state) => state.inputMode);
  const [data, setData] = useState<CDCresponse>();
  const [lichessData, setLichessData] = useState<LichessResponse>();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [loaded, setLoaded] = useState(false);
  const month = new Date(date.year, date.month - 1).toLocaleString("default", {
    month: "long",
  });

  const sourceLabel = inputMode === "lichess" ? "Lichess" : "Chess.com";

  const fetchData = async (date: CalendarDate) => {
    setLoaded(false);
    try {
      if (inputMode === "lichess") {
        const response = await getLichessGamesOfPlayer(input, date.month, date.year);
        setLichessData(response);
      } else {
        const response = await getGamesOfPlayer(input, date.month, date.year);
        setData(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaded(true);
    }
  };
  const resetDateAndFetch = (newDate: CalendarDate) => {
    setDate(newDate);
    fetchData(newDate);
  };
  useEffect(() => {
    if (isOpen) {
      if (input !== "") fetchData(date);
    } else setDate(today(getLocalTimeZone()));
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="cover">
          <Modal.Dialog className="max-h-90 max-w-190">
            <Modal.Header className="flex flex-col justify-center gap-3 text-center">
              {loaded ? "Searched" : "Searching"} for game of {input} for {month} {date.year} in{" "}
              {sourceLabel}
              <div className="flex-center pb-3">
                <ChooseMonth onClick={resetDateAndFetch} />
              </div>
            </Modal.Header>
            <Modal.CloseTrigger />
            <Modal.Body>
              {loaded ? (
                inputMode === "lichess" ? (
                  lichessData === undefined ? (
                    "Couldn't fetch Data"
                  ) : isLichessGamesResponse(lichessData) ? (
                    <LichessGameTable games={lichessData.data} userName={input} />
                  ) : (
                    <div className="p-4 text-center">
                      Error occurred while fetching, Make Sure Username is correct
                      <br />
                      {JSON.stringify(lichessData.data)}
                      <br />
                      Try again
                    </div>
                  )
                ) : data === undefined ? (
                  "Couldn't fetch Data"
                ) : isGameResponse(data) ? (
                  <GameTable tableData={data.data} userName={input} />
                ) : (
                  <div className="p-4 text-center">
                    Error occurred while fetching, Make Sure Username is correct
                    <br />
                    {JSON.stringify(data.data)}
                    <br />
                    Try again
                  </div>
                )
              ) : (
                <LoadingTable />
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
