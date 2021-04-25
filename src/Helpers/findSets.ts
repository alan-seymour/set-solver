import { SetCard } from "../Classes/SetCard";

export const findSets = (cards: SetCard[]): SetCard[][] => {
  const sets: SetCard[][] = [];
  for (let i = 0; i <= cards.length - 3; i++) {
    for (let j = i + 1; j <= cards.length - 2; j++) {
      for (let k = j + 1; k <= cards.length - 1; k++) {
        if (isSet([cards[i], cards[j], cards[k]])) {
          sets.push([cards[i], cards[j], cards[k]]);
        }
      }
    }
  }
  return sets;
};

const isSet = (cards: SetCard[]): boolean => {
  const colourSet = new Set();
  const shapeSet = new Set();
  const shadingSet = new Set();
  const countSet = new Set();
  cards.forEach((c) => {
    colourSet.add(c.shapeType.colour);
    shapeSet.add(c.shapeType.shape);
    shadingSet.add(c.shapeType.shading);
    countSet.add(c.shapeCount());
  });

  return (
    colourSet.size % 2 === 1 &&
    shapeSet.size % 2 === 1 &&
    shadingSet.size % 2 === 1 &&
    countSet.size % 2 === 1
  );
};
