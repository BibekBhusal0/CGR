import { FC, useState } from "react";
import { CDCresponse, gamesOnChessDotCom, isGameResponse } from "../api/CDC";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  CalendarDate,
  useDisclosure,
} from "@nextui-org/react";
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

  const fetchData = async () => {
    setLoaded(false);
    try {
      const response = await gamesOnChessDotCom(input, date.month, date.year);
      setData(response);
      setLoaded(true);
    } catch (error) {
      setLoaded(true);
      console.log(error);
    }
  };
  const resetDateAndFetch = (newDate: CalendarDate) => {
    setDate(newDate);
    fetchData();
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
          <ModalHeader className="text-center flex justify-center gap-3 flex-col">
            {loaded ? "Searched" : "Searching"} for game of {input} for {month}{" "}
            {date.year} in Chess.com
            <div className="flex gap-3 justify-center">
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
                <div className="text-center">
                  error occored while fetching
                  <br />
                  {JSON.stringify(data.data)}
                  <br />
                  Try again
                </div>
              )
            ) : (
              <LoadingTable></LoadingTable>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
