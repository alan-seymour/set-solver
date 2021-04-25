import cv from "@techstark/opencv-js";

export const vectorLength = (vector: cv.Point): number =>
  Math.sqrt(vector.x ** 2 + vector.y ** 2);

export const cloneVector = ({ x, y }: cv.Point): cv.Point => new cv.Point(x, y);

export const subtractVector = (a: cv.Point, b: cv.Point): cv.Point =>
  new cv.Point(a.x - b.x, a.y - b.y);

export const addVector = (a: cv.Point, b: cv.Point): cv.Point =>
  new cv.Point(a.x + b.x, a.y + b.y);

export const scalarMultiplyVector = (
  { x, y }: cv.Point,
  scalar: number
): cv.Point => new cv.Point(x * scalar, y * scalar);

export const distanceSquared = (a: cv.Point, b: cv.Point): number =>
  (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
