import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { CalendarDate, RangeCalendar } from "@heroui/calendar";
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
        <Popover isOpen={open} backdrop="blur" onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger>
                <Button color="primary" className="px-10 py-5 text-lg">
                    Select Another Month
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <RangeCalendar
                    color="success"
                    aria-label="choose month"
                    value={getRange()}
                    isReadOnly
                    maxValue={today(getLocalTimeZone())}
                    focusedValue={start}
                    nextButtonProps={{ onPress: () => changeMonth(1) }}
                    prevButtonProps={{ onPress: () => changeMonth(-1) }}
                    bottomContent=<div className="flex justify-center p-2">
                        <Button
                            color="primary"
                            variant="solid"
                            onPress={() => {
                                onClick(start);
                                setOpen(false);
                            }}>
                            Select
                        </Button>
                    </div>
                />
            </PopoverContent>
        </Popover>
    );
}
