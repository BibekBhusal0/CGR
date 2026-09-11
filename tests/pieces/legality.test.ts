import { expect, test, describe } from "bun:test";
import { DEFAULT_POSITION } from "chess.js";
import { isMoveLegal } from "@/Logic/pieces";

describe("isMoveLegal", () => {
  test("pawn double push legal, triple illegal", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "e2e4")).toBe(true);
    expect(isMoveLegal(DEFAULT_POSITION, "e2e5")).toBe(false);
  });

  test("knight develops, illegal knight slide rejected", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "g1f3")).toBe(true);
    expect(isMoveLegal(DEFAULT_POSITION, "g1g3")).toBe(false);
  });

  test("from an empty square is illegal", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "e4e5")).toBe(false);
    expect(isMoveLegal(DEFAULT_POSITION, "a3a4")).toBe(false);
  });

  test("landing on your own piece is illegal", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "b1d2")).toBe(false);
    expect(isMoveLegal(DEFAULT_POSITION, "f1e2")).toBe(false);
  });

  test("capturing an enemy piece is legal", () => {
    expect(isMoveLegal("4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1", "e4d5")).toBe(true);
  });

  test("absolutely pinned knight cannot leave the pin line", () => {
    expect(isMoveLegal("4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1", "e2g1")).toBe(false);
  });

  test("same knight move is legal without the pin", () => {
    expect(isMoveLegal("4k3/8/8/8/8/8/4N3/4K3 w - - 0 1", "e2g1")).toBe(true);
  });

  test("pinned rook may still slide along the pin axis", () => {
    expect(isMoveLegal("4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1", "e2e3")).toBe(true);
    expect(isMoveLegal("4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1", "e2a2")).toBe(false);
  });

  test("king may not walk into check", () => {
    const fen = "4k3/8/8/8/8/4r3/8/4K3 w - - 0 1";
    expect(isMoveLegal(fen, "e1e2")).toBe(false);
    expect(isMoveLegal(fen, "e1d1")).toBe(true);
  });

  test("promotion to queen and knight", () => {
    const fen = "3k4/4P3/8/8/8/8/8/4K3 w - - 0 1";
    expect(isMoveLegal(fen, "e7e8q")).toBe(true);
    expect(isMoveLegal(fen, "e7e8n")).toBe(true);
  });

  test("pushing onto the enemy king square is illegal", () => {
    expect(isMoveLegal("4k3/4P3/8/8/8/8/8/4K3 w - - 0 1", "e7e8q")).toBe(false);
  });

  test("en passant capture", () => {
    expect(
      isMoveLegal("rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1", "e5d6")
    ).toBe(true);
    expect(isMoveLegal(DEFAULT_POSITION, "e5d6")).toBe(false);
  });

  test("kingside castle with rights", () => {
    expect(isMoveLegal("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1", "e1g1")).toBe(true);
  });

  test("castle without rights rejected", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "e1g1")).toBe(false);
  });

  test("wrong side to move rejected", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "e7e5")).toBe(false);
  });

  test("garbage fen rejected", () => {
    expect(isMoveLegal("invalid", "e2e4")).toBe(false);
  });

  test("garbage move rejected", () => {
    expect(isMoveLegal(DEFAULT_POSITION, "zzzz")).toBe(false);
  });
});
