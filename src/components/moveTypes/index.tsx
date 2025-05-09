import { FC } from "react";
import { MT, MoveTypeColors } from "./types";
import { MoveIcon } from "./MoveIcon";

export const MoveClass: FC<{
  type: MT;
  counts?: { white: number; black: number };
}> = ({ type, counts }) => {
  let black, white;
  if (!counts) {
    black = 0;
    white = 0;
  } else {
    black = counts.black;
    white = counts.white;
  }
  return (
    <div
      style={{ color: MoveTypeColors[type] }}
      className="grid w-full grid-cols-8 text-center text-lg">
      <div className="col-span-2">{white}</div>
      <div className="col-span-4">
        <div className="w-full">
          <div className="flex items-center justify-around gap-3 text-left align-middle capitalize">
            {!counts ? (
              <>
                <div
                  style={{ backgroundColor: MoveTypeColors[type] }}
                  className="size-7 animate-pulse rounded-full"></div>
                <div
                  style={{ backgroundColor: MoveTypeColors[type] }}
                  className="my-1 h-5 w-20 animate-pulse rounded-md"></div>
              </>
            ) : (
              <>
                <MoveIcon type={type} />
                <div>{type}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2">{black}</div>
    </div>
  );
};
