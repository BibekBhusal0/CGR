import { Chess } from "chess.js";

const game = new Chess("1br2rk1/pp2np1p/2n1pBp1/3p4/3P1q1Q/2PB1N1P/PP3PP1/R4RK1 w - - 0 1");
// Knight at e7 is hanging, which is attacked by bishop and queen but the
// attackers only shows bishop becuase queen is attacking through bishop
console.log(game.attackers("e7", "b"));
