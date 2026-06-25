import { FC, useEffect, useState } from "react";
import { CDCresponse, getGamesOfPlayer, isGameResponse } from "@/api/CDC";
import { Modal , Calendar } from "@heroui/react";
import { GameTable, LoadingTable } from "@/app/right_panel/input/game_table";
import { today, getLocalTimeZone } from "@internationalized/date";
import ChooseMonth from "@/components/chooseMonth";

type SelectGameProps = { input: string; toggle: () => void; isOpen: boolean };

export const SelectGame: FC<SelectGameProps> = ({ input, toggle, isOpen }) => {
  const [data, setData] = useState<CDCresponse>();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [loaded, setLoaded] = useState(false);
  const month = new Date(date.year, date.month - 1).toLocaleString("default", {
    month: "long",
  });

  const fetchData = async (date: any) => {
    setLoaded(false);
    try {
      const response = await getGamesOfPlayer(input, date.month, date.year);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoaded(true);
    }
  };
  const resetDateAndFetch = (newDate: any) => {
    setDate(newDate);
    fetchData(newDate);
  };
  useEffect(() => {
    if (isOpen) {
      if (input !== "") fetchData(date);
    } else setDate(today(getLocalTimeZone()));
  }, [isOpen]);

  return (
    <>
      <Modal
        // size="3xl"
        isOpen={isOpen}
        // toggle={toggle}
      >
        <Modal.Container>
          <Modal.Header className="flex flex-col justify-center gap-3 text-center">
            {loaded ? "Searched" : "Searching"} for game of {input} for {month} {date.year} in
            Chess.com
            <div className="flex justify-center gap-3">
              <ChooseMonth onClick={resetDateAndFetch} />
            </div>
          </Modal.Header>
          <Modal.Container><Modal.Dialog>
          <Modal.CloseTrigger />
            {loaded ? (
              data === undefined ? (
                "Couldn't fetch Data"
              ) : isGameResponse(data) ? (
                <GameTable tableData={data.data} userName={input}></GameTable>
              ) : (
                <div className="p-4 text-center">
                  error occurred while fetching
                  <br />
                  {JSON.stringify(data.data)}
                  <br />
                  Try again
                </div>
              )
            ) : (
              <LoadingTable />
            )}
          </Modal.Dialog></Modal.Container>
        </Modal.Container>
      </Modal>
    </>
  );
};
