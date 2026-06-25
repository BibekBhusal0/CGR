import {
  Popover,
  Button,
  DateRangePicker,
  RangeCalendar,
} from "@heroui/react";
import {
  today,
  startOfMonth,
  getLocalTimeZone,
  isSameMonth,
  isSameYear,
  endOfMonth,
} from "@internationalized/date";
import { useState } from "react";

export type chooseMonthProps = { onClick: (newDate: CalendarDate) => void };
export default function ChooseMonth({ onClick }: chooseMonthProps) {
  const currentDate = today(getLocalTimeZone());
  const [start, setStart] = useState(startOfMonth(currentDate));
  const [open, setOpen] = useState(false);
  const isCurrentMonth = isSameMonth(start, currentDate) && isSameYear(start, currentDate);
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
    const newDate = add ? start.add({ months: n }) : start.subtract({ months: n });
    setStart(newDate);
  };

  return (
    <Popover
      isOpen={open}
      // backdrop="blur"
      onOpenChange={(open) => setOpen(open)}>
      <Popover.Trigger>
        <Button
          // color="primary"
          className="px-10 py-5 text-lg">
          Select Another Month
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <DateRangePicker
          // color="success"
          aria-label="choose month"
          value={getRange()}
          isReadOnly
          maxValue={today(getLocalTimeZone())}
          // focusedValue={start}
          // nextButtonProps={{ onPress: () => changeMonth(1) }}
          // prevButtonProps={{ onPress: () => changeMonth(-1) }}
          // bottomContent=<div className="flex justify-center p-2">
          //   <Button
          //     // color="primary"
          //     // variant="solid"
          //     onPress={() => {
          //       onClick(start);
          //       setOpen(false);
          //     }}>
          //     Select
          //   </Button>
          // </div>
        >
          <DateRangePicker.Popover>
            <RangeCalendar>
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      </Popover.Content>
    </Popover>
  );
}
