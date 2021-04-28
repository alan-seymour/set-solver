import { v4 as uuid } from "uuid";
import { ShapeType } from "./ShapeType";
import cv from "@techstark/opencv-js";
import { growContour } from "../Helpers/contourHelpers";
import { black, meanRGBToHSL, white } from "../Helpers/colours";

export class SetShape {
  shapeType: ShapeType;
  minRect: cv.RotatedRect;
  minLength: number;
  contour: cv.Mat;
  childContour: cv.Mat;
  parentContour: cv.Mat;
  invalid: boolean;
  meanContour?: cv.Scalar;
  meanInside?: cv.Scalar;
  meanOutside?: cv.Scalar;
  extent: number;
  id: string;

  constructor(contour: cv.Mat, minRect: cv.RotatedRect, shapeExtent: number) {
    const { width, height } = minRect.size;
    const minLength = Math.min(width, height);

    this.id = uuid();
    this.minRect = minRect;
    this.minLength = Math.min(minRect.size.width, minRect.size.height);
    this.contour = contour;
    this.childContour = growContour(contour, minLength * -0.1);
    this.parentContour = growContour(contour, minLength * 0.2);
    this.shapeType = new ShapeType();
    this.invalid = false;
    this.extent = shapeExtent;
  }

  setShape() {
    if (this.meanContour && this.meanInside && this.meanOutside) {
      this.shapeType.setShapeType(this.extent);
      this.shapeType.setShapeColour(meanRGBToHSL(this.meanContour));
      this.shapeType.setShapeShading(
        meanRGBToHSL(this.meanInside),
        meanRGBToHSL(this.meanOutside)
      );
    }
  }

  validateBounds(originalImage: cv.Mat) {
    const { width, height } = originalImage.size();
    const rect = cv.boundingRect(this.parentContour);

    this.invalid =
      rect.x < 0 ||
      rect.x + rect.width >= width ||
      rect.y < 0 ||
      rect.y + rect.height >= height;
  }

  calculateMeans(originalImage: cv.Mat) {
    const matVec = new cv.MatVector();
    matVec.push_back(this.childContour);
    matVec.push_back(this.contour);
    matVec.push_back(this.parentContour);

    const rect = cv.boundingRect(this.parentContour);
    const offset = new cv.Point(-rect.x, -rect.y);

    const roi = originalImage.roi(rect);
    const roiSize = roi.size();
    const mask = cv.Mat.zeros(roiSize.height, roiSize.width, cv.CV_8U);

    cv.drawContours(
      mask,
      matVec,
      0,
      white,
      -1,
      cv.LINE_8,
      new cv.Mat(),
      0,
      offset
    );

    this.meanInside = cv.mean(roi, mask);

    cv.drawContours(
      mask,
      matVec,
      1,
      white,
      -1,
      cv.LINE_8,
      new cv.Mat(),
      0,
      offset
    );
    cv.drawContours(
      mask,
      matVec,
      0,
      black,
      -1,
      cv.LINE_8,
      new cv.Mat(),
      0,
      offset
    );

    this.meanContour = cv.mean(roi, mask);

    cv.drawContours(
      mask,
      matVec,
      2,
      white,
      -1,
      cv.LINE_8,
      new cv.Mat(),
      0,
      offset
    );
    cv.drawContours(
      mask,
      matVec,
      1,
      black,
      -1,
      cv.LINE_8,
      new cv.Mat(),
      0,
      offset
    );

    this.meanOutside = cv.mean(roi, mask);

    roi.delete();
    mask.delete();
    matVec.delete();

    const hslInside = meanRGBToHSL(this.meanInside);
    const hslOutside = meanRGBToHSL(this.meanOutside);
    this.invalid = hslInside[2] - hslOutside[2] > 10;
  }

  adjustWhiteBalance([r, g, b]: [number, number, number]) {
    if (this.meanContour) {
      this.meanContour[0] -= r;
      this.meanContour[1] -= g;
      this.meanContour[2] -= b;
    }
  }
}
