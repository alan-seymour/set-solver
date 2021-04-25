import cv from "@techstark/opencv-js";
import { SetCard } from "../Classes/SetCard";
import { SetShape } from "../Classes/SetShape";
import { findShapes } from "./findShapes";
import { distanceSquared } from "./vectorHelpers";

const addShapesToCards = (
  cards: SetCard[],
  shape: SetShape,
  otherShape: SetShape
) => {
  for (let card of cards) {
    if (card.shapes.includes(shape)) {
      card.shapes.push(otherShape);
      return;
    } else if (card.shapes.includes(otherShape)) {
      card.shapes.push(shape);
      return;
    }
  }

  cards.push(new SetCard(shape.shapeType, [shape, otherShape]));
};

const findSetCards = (shapes: SetShape[]) => {
  const linkedShapes: SetShape[] = [];
  const foundCards: SetCard[] = [];

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    let isShapeLinked = linkedShapes.includes(shape);

    for (let k = i + 1; k < shapes.length; k++) {
      let other = shapes[k];

      if (!other.shapeType.equals(shape.shapeType)) {
        continue;
      }

      const midDistSquared = distanceSquared(
        shape.minRect.center,
        other.minRect.center
      );

      if (
        Math.sqrt(midDistSquared) <
        1.75 * Math.max(shape.minLength, other.minLength)
      ) {
        linkedShapes.push(other);
        addShapesToCards(foundCards, shape, other);
        isShapeLinked = true;
      }
    }

    if (!isShapeLinked) {
      foundCards.push(new SetCard(shape.shapeType, [shape]));
    }
  }

  return foundCards;
};

export const detectSetCards = (image: cv.Mat) => {
  const shapes = findShapes(image);
  const cards = findSetCards(shapes);

  return cards;
};
