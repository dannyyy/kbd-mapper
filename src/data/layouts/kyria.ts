import type { PhysicalLayout } from "../../types/layout";

// Kyria: 50 keys, split with extra thumb keys and encoder positions
const LEFT_STAGGER = [0.3, 0.1, 0, -0.125, -0.05];
const RIGHT_STAGGER = [-0.05, -0.125, 0, 0.1, 0.3];

function leftKeys() {
  const keys: Array<{
    x: number;
    y: number;
    r?: number;
    rx?: number;
    ry?: number;
  }> = [];

  // 3 rows x 6 cols (first col offset)
  for (let row = 0; row < 3; row++) {
    // Extra pinky column
    keys.push({ x: -0.25, y: row + 0.4 });
    for (let col = 0; col < 5; col++) {
      keys.push({ x: col + 0.75, y: row + LEFT_STAGGER[col]! });
    }
  }

  // 5 thumb keys (fanned arc)
  keys.push(
    { x: 2.5, y: 3.5 },
    { x: 3.5, y: 3.25 },
    { x: 4.5, y: 3.0 },
    { x: 5.25, y: 2.75, r: 10, rx: 5.25, ry: 2.75 },
    { x: 6.0, y: 2.75, r: 20, rx: 5.25, ry: 2.75 },
  );
  return keys;
}

function rightKeys() {
  const keys: Array<{
    x: number;
    y: number;
    r?: number;
    rx?: number;
    ry?: number;
  }> = [];
  const offset = 8;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! });
    }
    // Extra pinky column
    keys.push({ x: offset + 5.25, y: row + 0.4 });
  }

  // 5 thumb keys (fanned arc, mirrored)
  keys.push(
    { x: offset - 1, y: 2.75, r: -20, rx: offset + 0.75, ry: 2.75 },
    { x: offset - 0.25, y: 2.75, r: -10, rx: offset + 0.75, ry: 2.75 },
    { x: offset + 0.5, y: 3.0 },
    { x: offset + 1.5, y: 3.25 },
    { x: offset + 2.5, y: 3.5 },
  );
  return keys;
}

export const kyria: PhysicalLayout = {
  id: "kyria",
  name: "Kyria",
  keys: [...leftKeys(), ...rightKeys()],
  splits: [23],
  metadata: {
    source: "builtin",
    tags: ["split", "ergonomic", "50-key", "encoders"],
  },
};
