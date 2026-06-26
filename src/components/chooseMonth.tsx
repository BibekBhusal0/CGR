import { DateRangePicker, RangeCalendar, DateField, Button } from "@heroui/react";
import {
  today,
  startOfMonth,
  getLocalTimeZone,
  isSameMonth,
  isSameYear,
  endOfMonth,
} from "@internationalized/date";
import { useState } from "react";

export type chooseMonthProps = { onClick: (newDate: any) => void };
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
    <DateRangePicker
      endName="endDate"
      startName="startDate"
      maxValue={today(getLocalTimeZone())}
      value={getRange()}>
      <DateField.Group>
        <Button onClick={() => setOpen(true)}>Select Month</Button>
      </DateField.Group>
      <DateRangePicker.Popover isOpen={open} onOpenChange={setOpen}>
        <RangeCalendar
          aria-label="Choose trip dates"
          value={getRange()}
          maxValue={today(getLocalTimeZone())}>
          <RangeCalendar.Header>
            {/* <RangeCalendar.YearPickerTrigger> */}
            {/*   <RangeCalendar.YearPickerTriggerHeading /> */}
            {/*   <RangeCalendar.YearPickerTriggerIndicator /> */}
            {/* </RangeCalendar.YearPickerTrigger> */}
            <RangeCalendar.NavButton slot="previous" onClick={() => changeMonth(-1)} />
            <RangeCalendar.NavButton slot="next" onClick={() => changeMonth(1)} />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
          {/* <RangeCalendar.YearPickerGrid> */}
          {/*   <RangeCalendar.YearPickerGridBody> */}
          {/*     {({ year }) => <RangeCalendar.YearPickerCell year={year} />} */}
          {/*   </RangeCalendar.YearPickerGridBody> */}
          {/* </RangeCalendar.YearPickerGrid> */}
        </RangeCalendar>
        <div className="flex-center w-full">
          <Button
            onClick={() => {
              onClick(start);
              setOpen(false);
            }}
            className="flex-center">
            Select
          </Button>
        </div>
      </DateRangePicker.Popover>
    </DateRangePicker>
  );
}
