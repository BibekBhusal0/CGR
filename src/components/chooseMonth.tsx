import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";
import { CalendarDate, RangeCalendar } from "@nextui-org/calendar";
import {
  today,
  startOfMonth,
  getLocalTimeZone,
  isSameMonth,
  isSameYear,
  endOfMonth,
} from "@internationalized/date";
import { useState } from "react";

export default function ChooseMonth({
  onClick,
}: {
  onClick: (newDate: CalendarDate) => void;
}) {
  const currentDate = today(getLocalTimeZone());
  const [start, setStart] = useState(startOfMonth(currentDate));
  const [open, setOpen] = useState(false);
  const monthName = new Date(start.year, start.month - 1).toLocaleString(
    "default",
    { month: "long" }
  );
  const isCurrentMonth =
    isSameMonth(start, currentDate) && isSameYear(start, currentDate);
  const getRange = () => {
    const endDate = isCurrentMonth ? currentDate : endOfMonth(start);
    return {
      start,
      end: endDate,
    };
  };

  const changeMonth = (n: number) => {
    const add = n > 0;
    n = Math.abs(n);
    const newDate = add
      ? start.add({ months: n })
      : start.subtract({ months: n });
    setStart(newDate);
  };
  const buttons = ["Previous", "Next"];

  return (
    <Popover
      showArrow
      isOpen={open}
      backdrop="blur"
      onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger>
        <Button color="primary" className="text-lg px-10 py-5 ">
          Select Another Month
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <RangeCalendar
          aria-label="test"
          value={getRange()}
          isReadOnly
          maxValue={today(getLocalTimeZone())}
          focusedValue={start}
          classNames={{
            headerWrapper: "hidden",
          }}
          topContent=<ButtonGroup className=" py-2 px-1 bg-default-50">
            {buttons.map((b) => (
              <Button
                variant="ghost"
                className="font-semibold"
                color="primary"
                onPress={() => changeMonth(b === "Next" ? 1 : -1)}
                isDisabled={b === "Next" && isCurrentMonth}
                key={b}>
                {b} Month
              </Button>
            ))}
          </ButtonGroup>
          bottomContent=<div className="flex justify-center p-2">
            <Button
              color="primary"
              variant="shadow"
              onPress={() => {
                onClick(start);
                setOpen(false);
              }}>
              Select {start.year} {monthName}
            </Button>
          </div>
        />
      </PopoverContent>
    </Popover>
  );
}
