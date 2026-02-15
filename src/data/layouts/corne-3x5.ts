import type { PhysicalLayout } from "../../types/layout";

const LEFT_STAGGER = [0, -0.125, -0.25, -0.125, 0];
const RIGHT_STAGGER = [-0.125, -0.25, -0.125, 0, 0];

function leftKeys() {
  const keys: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      keys.push({ x: col, y: row + LEFT_STAGGER[col]! });
    }
  }
  // 3 thumb keys
  keys.push({ x: 2, y: 3.25 }, { x: 3, y: 3.0 }, { x: 4, y: 2.75 });
  return keys;
}

function rightKeys() {
  const keys: Array<{ x: number; y: number }> = [];
  const offset = 6;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! });
    }
  }
  keys.push(
    { x: offset, y: 2.75 },
    { x: offset + 1, y: 3.0 },
    { x: offset + 2, y: 3.25 },
  );
  return keys;
}

export const corne3x5: PhysicalLayout = {
  id: "corne-3x5",
  name: "Corne 3×5+3",
  keys: [...leftKeys(), ...rightKeys()],
  splits: [18],
  metadata: {
    source: "builtin",
    tags: ["split", "ergonomic", "36-key", "columnar"],
  },
};
