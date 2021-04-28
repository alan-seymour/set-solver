import cv from "@techstark/opencv-js";
import { SetCard } from "../Classes/SetCard";
import { SetShape } from "../Classes/SetShape";
import { black } from "./colours";
import {
  addVector,
  cloneVector,
  subtractVector,
  vectorLength,
} from "./vectorHelpers";

export const drawSetOnImage = (
  image: cv.Mat,
  set: SetCard[],
  colour: number[]
) => {
  const mid0 = set[0].mid();
  const mid1 = set[1].mid();
  const mid2 = set[2].mid();

  const dist0 = vectorLength(subtractVector(mid0, mid1));
  const dist1 = vectorLength(subtractVector(mid1, mid2));
  const dist2 = vectorLength(subtractVector(mid2, mid0));

  if (dist0 < dist1) {
    drawLineBetween(set[0], set[1], image, colour, 3);

    if (dist1 < dist2) {
      drawLineBetween(set[1], set[2], image, colour, 3);
    } else {
      drawLineBetween(set[2], set[0], image, colour, 3);
    }
  } else {
    drawLineBetween(set[1], set[2], image, colour, 3);

    if (dist0 < dist2) {
      drawLineBetween(set[0], set[1], image, colour, 3);
    } else {
      drawLineBetween(set[2], set[0], image, colour, 3);
    }
  }
};

const drawLineBetween = (
  card1: SetCard,
  card2: SetCard,
  image: cv.Mat,
  colour: number[],
  width: number
) => {
  let mid1 = card1.mid();
  let mid2 = card2.mid();

  cv.circle(image, mid1, 2 * width, colour, -1, cv.LINE_AA);
  cv.circle(image, mid2, 2 * width, colour, -1, cv.LINE_AA);
  cv.line(image, mid1, mid2, colour, width, cv.LINE_AA);
};

export const drawShapeOnImage = (image: cv.Mat, shape: SetShape) => {
  const mid = shape.minRect.center;

  cv.circle(image, mid, (shape.minLength * 2) / 3, shape.meanContour, -1);
  cv.circle(image, mid, shape.minLength / 2, shape.meanInside, -1);

  const label = `${shape.shapeType.colour?.[0] ?? "?"}${
    shape.shapeType.shape?.[0].toUpperCase() ?? "?"
  }${shape.shapeType.shading?.slice(0, 2) ?? "??"}`;

  const anchor = addVector(cloneVector(mid), { x: -20, y: 5 });

  cv.putText(
    image,
    label,
    anchor,
    cv.FONT_HERSHEY_SIMPLEX,
    0.5,
    black,
    1,
    cv.LINE_AA
  );
};
