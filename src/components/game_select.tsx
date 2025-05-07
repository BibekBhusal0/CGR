import { FC, useState } from "react";
import { CDCresponse, gamesOnChessDotCom, isGameResponse } from "../api/CDC";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { CalendarDate } from "@heroui/calendar";
import { GameTable, LoadingTable } from "./game_table";
import { today, getLocalTimeZone } from "@internationalized/date";
import ChooseMonth from "./chooseMonth";

export const SelectGame: FC<{ input: string }> = ({ input }) => {
  const [data, setData] = useState<CDCresponse>();
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [loaded, setLoaded] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const month = new Date(date.year, date.month - 1).toLocaleString("default", {
    month: "long",
  });

  const fetchData = async (date: CalendarDate) => {
    setLoaded(false);
    try {
      const response = await gamesOnChessDotCom(input, date.month, date.year);
      setData(response);
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

  return (
    <>
      <Button
        variant="shadow-sm"
        color="primary"
        className="py-8 text-2xl font-semibold"
        isDisabled={input.trim() === ""}
        onPress={() => {
          onOpen();
          fetchData(date);
        }}>
        Choose Games
      </Button>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col justify-center gap-3 text-center">
            {loaded ? "Searched" : "Searching"} for game of {input} for {month} {date.year} in
            Chess.com
            <div className="flex justify-center gap-3">
              <ChooseMonth onClick={resetDateAndFetch} />
            </div>
          </ModalHeader>
          <ModalBody>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
