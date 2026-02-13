import { expect, test, describe } from "bun:test";
import { getDirection } from "../../src/Logic/pieces";

describe("Right", () => {
  test("case 0", () => {
    const result = getDirection("a3", "g3");
    expect(result).toBe("right");
  });

  test("case 1", () => {
    const result = getDirection("c4", "d4");
    expect(result).toBe("right");
  });

  test("case 2", () => {
    const result = getDirection("b7", "h7");
    expect(result).toBe("right");
  });
});

describe("Left", () => {
  test("case 0", () => {
    const result = getDirection("h3", "b3");
    expect(result).toBe("left");
  });

  test("case 1", () => {
    const result = getDirection("d4", "c4");
    expect(result).toBe("left");
  });

  test("case 2", () => {
    const result = getDirection("h7", "b7");
    expect(result).toBe("left");
  });
});

describe("Up", () => {
  test("case 0", () => {
    const result = getDirection("a3", "a4");
    expect(result).toBe("up");
  });

  test("case 1", () => {
    const result = getDirection("e1", "e8");
    expect(result).toBe("up");
  });

  test("case 2", () => {
    const result = getDirection("b6", "b7");
    expect(result).toBe("up");
  });
});

describe("Down", () => {
  test("case 0", () => {
    const result = getDirection("a4", "a3");
    expect(result).toBe("down");
  });

  test("case 1", () => {
    const result = getDirection("e8", "e1");
    expect(result).toBe("down");
  });

  test("case 2", () => {
    const result = getDirection("b7", "b6");
    expect(result).toBe("down");
  });
});

describe("up-left", () => {
  test("case 0", () => {
    const result = getDirection("h1", "a8");
    expect(result).toBe("up-left");
  });

  test("case 1", () => {
    const result = getDirection("e1", "d2");
    expect(result).toBe("up-left");
  });

  test("case 2", () => {
    const result = getDirection("c1", "a3");
    expect(result).toBe("up-left");
  });
});

describe("up-right", () => {
  test("case 0", () => {
    const result = getDirection("a1", "h8");
    expect(result).toBe("up-right");
  });

  test("case 1", () => {
    const result = getDirection("e1", "f2");
    expect(result).toBe("up-right");
  });

  test("case 2", () => {
    const result = getDirection("b7", "c8");
    expect(result).toBe("up-right");
  });
});

describe("down-left", () => {
  test("case 0", () => {
    const result = getDirection("h8", "a1");
    expect(result).toBe("down-left");
  });

  test("case 1", () => {
    const result = getDirection("e8", "d7");
    expect(result).toBe("down-left");
  });

  test("case 2", () => {
    const result = getDirection("f8", "c5");
    expect(result).toBe("down-left");
  });
});

describe("down-right", () => {
  test("case 0", () => {
    const result = getDirection("a8", "h1");
    expect(result).toBe("down-right");
  });

  test("case 1", () => {
    const result = getDirection("e8", "f7");
    expect(result).toBe("down-right");
  });

  test("case 2", () => {
    const result = getDirection("b5", "f1");
    expect(result).toBe("down-right");
  });
});

describe("None", () => {
  test("case 0", () => {
    const result = getDirection("a8", "h4");
    expect(result).toBeUndefined();
  });

  test("case 1", () => {
    const result = getDirection("b8", "f7");
    expect(result).toBeUndefined();
  });

  test("case 2", () => {
    const result = getDirection("b5", "g1");
    expect(result).toBeUndefined();
  });
});
