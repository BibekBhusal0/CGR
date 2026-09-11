import { expect, test, describe } from "bun:test";
import { Chess } from "chess.js";
import { extractClocks, formatClock, getClocksAtIndex } from "@/Logic/clocks";

describe("formatClock", () => {
  test("hours truncate sub-seconds and pad minutes", () => {
    expect(formatClock("1:02:03.4")).toBe("1:02:03");
    expect(formatClock("1:2:3")).toBe("1:02:03");
    expect(formatClock("2:00:00.9")).toBe("2:00:00");
    expect(formatClock("10:00:01")).toBe("10:00:01");
  });

  test("zero hour collapses to minutes and seconds", () => {
    expect(formatClock("0:09:07")).toBe("9:07");
    expect(formatClock("0:09:07.9")).toBe("9:07");
  });

  test("plain minute colon second stays as is", () => {
    expect(formatClock("1:05")).toBe("1:05");
    expect(formatClock("90:00")).toBe("90:00");
    expect(formatClock("0:10")).toBe("0:10");
  });

  test("bare seconds at or above ten become zero colon seconds", () => {
    expect(formatClock("15.2")).toBe("0:15");
    expect(formatClock("12")).toBe("0:12");
  });

  test("sub-ten seconds keep one decimal, whole seconds stay bare", () => {
    expect(formatClock("5.25")).toBe("5.3");
    expect(formatClock("0:09.9")).toBe("9.9");
    expect(formatClock("5.04")).toBe("5");
    expect(formatClock("5")).toBe("5");
    expect(formatClock("0")).toBe("0");
    expect(formatClock("0:00:09")).toBe("9");
    expect(formatClock("0:00:00.4")).toBe("0.4");
  });

  test("surrounding whitespace is trimmed", () => {
    expect(formatClock("  1:05  ")).toBe("1:05");
  });

  test("non-clock strings pass through untouched", () => {
    expect(formatClock("not-a-clock")).toBe("not-a-clock");
    expect(formatClock("abc:def")).toBe("abc:def");
    expect(formatClock("")).toBe("");
    expect(formatClock("--:--")).toBe("--:--");
  });

  test("never throws on any input", () => {
    const raws = ["1:00:00", "0:59.9", "5", "garbage"];
    for (const r of raws) {
      expect(() => formatClock(r)).not.toThrow();
    }
  });
});

describe("getClocksAtIndex", () => {
  test("empty / missing / negative index", () => {
    expect(getClocksAtIndex(undefined, 0)).toEqual({ white: undefined, black: undefined });
    expect(getClocksAtIndex([], 5)).toEqual({ white: undefined, black: undefined });
    expect(getClocksAtIndex(["1:00"], -1)).toEqual({ white: undefined, black: undefined });
  });

  test("white moves on even plies, black on odd", () => {
    const clocks = ["1:00", "0:59", "0:58", "0:57", "0:56"];
    expect(getClocksAtIndex(clocks, 0)).toEqual({ white: "1:00", black: undefined });
    expect(getClocksAtIndex(clocks, 1)).toEqual({ white: "1:00", black: "0:59" });
    expect(getClocksAtIndex(clocks, 2)).toEqual({ white: "0:58", black: "0:59" });
    expect(getClocksAtIndex(clocks, 3)).toEqual({ white: "0:58", black: "0:57" });
    expect(getClocksAtIndex(clocks, 4)).toEqual({ white: "0:56", black: "0:57" });
  });

  test("gaps keep last seen value per side", () => {
    const clocks = ["1:00", undefined, undefined, "0:57"];
    expect(getClocksAtIndex(clocks, 0)).toEqual({ white: "1:00", black: undefined });
    expect(getClocksAtIndex(clocks, 2)).toEqual({ white: "1:00", black: undefined });
    expect(getClocksAtIndex(clocks, 3)).toEqual({ white: "1:00", black: "0:57" });
  });

  test("index past the end clamps to last move", () => {
    expect(getClocksAtIndex(["1:00", "0:59"], 99)).toEqual({
      white: "1:00",
      black: "0:59",
    });
  });

  test("all-missing stays undefined", () => {
    expect(getClocksAtIndex([undefined, undefined, undefined], 2)).toEqual({
      white: undefined,
      black: undefined,
    });
  });
});

describe("extractClocks", () => {
  test("empty board -> no moves", () => {
    expect(extractClocks(new Chess())).toEqual([]);
  });

  test("pgn without clocks -> undefined per move", () => {
    const g = new Chess();
    g.loadPgn("1. e4 e5 2. Nf3 *");
    expect(extractClocks(g)).toEqual([undefined, undefined, undefined]);
  });

  test("non-clock comments are ignored, clock comments kept", () => {
    const g = new Chess();
    g.loadPgn(
      '[White "A"]\n[Black "B"]\n\n1. e4 { [%clk 1:00:00] } e5 { [%clk 0:59:00] } 2. Nf3 { some note } Nc6 { [%clk 0:58:30] } *'
    );
    expect(extractClocks(g)).toEqual(["1:00:00", "0:59:00", undefined, "0:58:30"]);
  });

  test("black-only clocks leave white undefined", () => {
    const g = new Chess();
    g.loadPgn("1. e4 e5 { [%clk 0:59:00] } *");
    expect(extractClocks(g)).toEqual([undefined, "0:59:00"]);
  });

  test("lichess-style sub-minute clocks preserved verbatim", () => {
    const g = new Chess();
    g.loadPgn("1. e4 { [%clk 0:03:00.1] } e5 { [%clk 0:02:59.9] } *");
    expect(extractClocks(g)).toEqual(["0:03:00.1", "0:02:59.9"]);
  });

  test("length always matches move count", () => {
    const g = new Chess();
    g.loadPgn("1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *");
    const clocks = extractClocks(g);
    expect(clocks).toHaveLength(6);
    expect(getClocksAtIndex(clocks, 5)).toEqual({ white: undefined, black: undefined });
  });

  test("result markers do not create entries", () => {
    const withResult = new Chess();
    withResult.loadPgn("1. e4 e5 1-0");
    const bare = new Chess();
    bare.loadPgn("1. e4 e5 *");
    expect(extractClocks(withResult)).toEqual(extractClocks(bare));
  });
});
