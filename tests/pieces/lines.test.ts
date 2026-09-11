import { expect, test, describe } from "bun:test";
import { Chess } from "chess.js";
import { getPiecesBetween, isEmpty } from "@/Logic/pieces";

describe("getPiecesBetween / isEmpty", () => {
  test("empty rank and file", () => {
    const g = new Chess("4k3/8/8/8/8/8/8/4K3 w - - 0 1", { skipValidation: true });
    expect(getPiecesBetween(g, "a2", "h2")).toEqual([]);
    expect(isEmpty(g, "a2", "h2")).toBe(true);
    expect(isEmpty(g, "b2", "b7")).toBe(true);
  });

  test("endpoints excluded, blockers reported from->to in order", () => {
    const g = new Chess("4k3/8/8/3pp3/8/8/8/4K3 w - - 0 1", { skipValidation: true });
    const between = getPiecesBetween(g, "a5", "h5");
    expect(between.map((p) => p.square)).toEqual(["d5", "e5"]);
    expect(between[0]).toMatchObject({ type: "p", color: "b" });
    expect(between[1]).toMatchObject({ type: "p", color: "b" });
    expect(isEmpty(g, "a5", "h5")).toBe(false);
  });

  test("reversed direction mirrors the order", () => {
    const g = new Chess("4k3/8/8/3pp3/8/8/8/4K3 w - - 0 1", { skipValidation: true });
    expect(getPiecesBetween(g, "h5", "a5").map((p) => p.square)).toEqual(["e5", "d5"]);
  });

  test("vertical file with both colors blocking, in order", () => {
    const g = new Chess("4k3/8/8/8/8/4p3/4P3/4K3 w - - 0 1", { skipValidation: true });
    const between = getPiecesBetween(g, "e1", "e8");
    expect(between.map((p) => p.square)).toEqual(["e2", "e3"]);
    expect(between[0]).toMatchObject({ type: "p", color: "w" });
    expect(between[1]).toMatchObject({ type: "p", color: "b" });
    expect(isEmpty(g, "e1", "e8")).toBe(false);
  });

  test("vertical file reversed", () => {
    const g = new Chess("4k3/8/8/8/8/4p3/4P3/4K3 w - - 0 1", { skipValidation: true });
    expect(getPiecesBetween(g, "e8", "e1").map((p) => p.square)).toEqual(["e3", "e2"]);
  });

  test("diagonal up-right blocker", () => {
    const g = new Chess("4k3/8/8/4b3/8/8/8/4K3 w - - 0 1", { skipValidation: true });
    const between = getPiecesBetween(g, "a1", "h8");
    expect(between.map((p) => p.square)).toEqual(["e5"]);
    expect(between[0]).toMatchObject({ type: "b", color: "b" });
    expect(isEmpty(g, "a1", "h8")).toBe(false);
  });

  test("diagonal down-left blocker", () => {
    const g = new Chess("4k3/8/8/8/4p3/8/8/4K3 w - - 0 1", { skipValidation: true });
    const between = getPiecesBetween(g, "h1", "a8");
    expect(between.map((p) => p.square)).toEqual(["e4"]);
    expect(between[0]).toMatchObject({ type: "p", color: "b" });
  });

  test("clear long diagonal is empty", () => {
    const g = new Chess("4k3/8/8/8/8/8/8/4K3 w - - 0 1", { skipValidation: true });
    expect(getPiecesBetween(g, "a1", "h8")).toEqual([]);
    expect(isEmpty(g, "a1", "h8")).toBe(true);
  });

  test("adjacent squares have nothing between", () => {
    const g = new Chess();
    expect(getPiecesBetween(g, "e2", "e3")).toEqual([]);
    expect(isEmpty(g, "e2", "e3")).toBe(true);
  });

  test("same square is empty", () => {
    const g = new Chess();
    expect(getPiecesBetween(g, "e4", "e4")).toEqual([]);
    expect(isEmpty(g, "e4", "e4")).toBe(true);
  });

  test("non-aligned squares terminate", () => {
    const g = new Chess();
    expect(Array.isArray(getPiecesBetween(g, "b1", "c3"))).toBe(true);
  });
});
