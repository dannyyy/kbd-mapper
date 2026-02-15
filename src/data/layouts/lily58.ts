import type { PhysicalLayout } from "../../types/layout";

// Lily58: 58 keys, split with number row, 4x6+4+1 per side
const LEFT_STAGGER = [0.5, 0.375, 0.125, 0, 0.125, 0.25];
const RIGHT_STAGGER = [0.25, 0.125, 0, 0.125, 0.375, 0.5];

function leftKeys() {
  const keys: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: col, y: row + LEFT_STAGGER[col]! });
    }
  }
  // 1 inner key
  keys.push({ x: 6, y: 2.75 });
  // 4 thumb keys
  keys.push(
    { x: 2.5, y: 4.125 },
    { x: 3.5, y: 4.15 },
    { x: 4.5, y: 4.25 },
    { x: 6, y: 4.25 },
  );
  return keys;
}

function rightKeys() {
  const keys: Array<{ x: number; y: number }> = [];
  const offset = 7.5;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! });
    }
  }
  // 1 inner key
  keys.push({ x: offset - 1, y: 2.75 });
  // 4 thumb keys
  keys.push(
    { x: offset - 1, y: 4.25 },
    { x: offset + 0.5, y: 4.25 },
    { x: offset + 1.5, y: 4.15 },
    { x: offset + 2.5, y: 4.15 },
  );
  return keys;
}

export const lily58: PhysicalLayout = {
  id: "lily58",
  name: "Lily58",
  keys: [...leftKeys(), ...rightKeys()],
  splits: [29],
  metadata: {
    source: "builtin",
    tags: ["split", "ergonomic", "58-key", "number-row"],
  },
};
