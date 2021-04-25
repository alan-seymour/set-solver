import cv from "@techstark/opencv-js";
import { addVector, scalarMultiplyVector } from "../Helpers/vectorHelpers";
import { SetShape } from "./SetShape";
import { ShapeType } from "./ShapeType";

export class SetCard {
  public shapeType: ShapeType;
  public shapes: SetShape[];

  constructor(shapeType: ShapeType, shapes: SetShape[] = []) {
    this.shapeType = shapeType;
    this.shapes = shapes;
  }

  shapeCount() {
    return this.shapes.length;
  }

  mid() {
    let center = new cv.Point(0, 0);

    for (let shape of this.shapes) {
      center = addVector(center, shape.minRect.center);
    }

    center = scalarMultiplyVector(center, 1 / this.shapes.length);
    return center;
  }
}
