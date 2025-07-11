import { motion } from "framer-motion";
import { openingType } from "@/Logic/analyze";
import { FC, useEffect, useState } from "react";
import { cn } from "@heroui/theme";

const OpeningCard: FC<{ opening?: openingType }> = ({ opening }) => {
  const [name, setName] = useState("");
  useEffect(() => {
    if (opening) {
      setName(opening.name);
    }
  }, [opening]);

  return (
    <>
      <div className="pt-1">{name}</div>
      {opening?.winRate !== undefined && <WinRateGraph data={opening.winRate} />}
    </>
  );
};

const WinRateGraph: FC<{
  data: { white: number; black: number; draws: number };
}> = ({ data }) => {
  const { white, draws, black } = data;
  const total = white + draws + black;
  if (total === 0) return null;

  const entries = [
    {
      label: "White",
      value: white,
      color: "bg-success-500",
      offset: 10,
      z: 22,
      pValue: white,
    },
    {
      label: "Draws",
      value: draws + white,
      color: "bg-default-500",
      offset: white - draws * 2,
      z: 21,
      pValue: draws,
    },
    {
      label: "Black",
      value: total,
      color: "bg-danger-500",
      offset: draws * 5 + white,
      z: 20,
      pValue: black,
    },
  ];

  return (
    <div className="relative mb-5 h-4 w-full">
      {entries.map(({ label, value, color, offset, z, pValue }) => (
        <>
          <motion.div
            style={{ zIndex: z }}
            className={cn("absolute top-0 h-full rounded-full", color)}
            initial={{ width: 0 }}
            animate={{
              width: `${(value / total) * 100}%`,
            }}></motion.div>
          <motion.div
            style={{ left: `${(offset * 100) / total}%` }}
            initial={{ y: 0 }}
            animate={{ y: `18px` }}
            className="absolute z-19 text-xs">
            {label}: {((pValue / total) * 100).toFixed(1)} %
          </motion.div>
        </>
      ))}
    </div>
  );
};

export default OpeningCard;
