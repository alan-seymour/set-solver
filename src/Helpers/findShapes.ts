import cv from "@techstark/opencv-js";
import { unsafeCoerce } from "fp-ts/lib/function";
import { SetShape } from "../Classes/SetShape";
import { findContours } from "./findContours";
import { makeGreyImage } from "./makeGreyImage";

const minContourPointRatio = 0.04;
const minBoundsSizeRatio = 0.03;
const minMinRectSizeRatio = 0.025;
const maxMinRectSizeRatio = 0.19;
const minExtent = 0.55;
const maxExtent = 0.9;
const minRatio = 1.3;
const maxRatio = 3.2;

export const findShapes = (image: cv.Mat): SetShape[] => {
  const greyImage = makeGreyImage(image);
  const contours = findContours(greyImage);
  const shapeCandidates = findCandidateShapes(contours, image);

  const actualShapes = filterActualShapes(shapeCandidates);

  greyImage.delete();
  contours.delete();

  return actualShapes;
};

const findCandidateShapes = (
  contours: cv.Mat,
  originalImage: cv.Mat
): SetShape[] => {
  const imageSize = originalImage.size();
  const minLength = Math.min(imageSize.width, imageSize.height);
  const minContourPoints = minLength * minContourPointRatio;
  const minBoundsSize = minLength * minBoundsSizeRatio;
  const minMinRectSize = minLength * minMinRectSizeRatio;
  const maxMinRectSize = minLength * maxMinRectSizeRatio;

  const possibleShapes: SetShape[] = [];

  const length = unsafeCoerce<cv.Size, number>(contours.size());

  for (let i = 0; i < length; i++) {
    const contour = contours.get(i);
    const cLength = contour.data32S.length;

    if (cLength < minContourPoints) {
      continue;
    }

    const boundingRect = cv.boundingRect(contour);

    if (
      boundingRect.width < minBoundsSize &&
      boundingRect.height < minBoundsSize
    ) {
      continue;
    }

    const minRect = cv.minAreaRect(contour);
    const { width, height } = minRect.size;

    if (width < minMinRectSize || height < minMinRectSize) {
      continue;
    }

    if (width > maxMinRectSize && height > maxMinRectSize) {
      continue;
    }

    if (!ratioFits(width, height)) {
      continue;
    }

    const area = cv.contourArea(contour);
    const shapeExtent = area / (width * height);

    if (shapeExtent < minExtent) {
      continue;
    }

    if (shapeExtent > maxExtent) {
      continue;
    }

    const shape = new SetShape(contour, minRect, shapeExtent);

    shape.validateBounds(originalImage);

    if (!shape.invalid) {
      shape.calculateMeans(originalImage);
    }

    if (!shape.invalid) {
      possibleShapes.push(shape);
    }
  }

  const wb = calculateWhiteBalanceAdjustments(possibleShapes);

  possibleShapes.forEach((s) => {
    s.adjustWhiteBalance(wb);
    s.setShape();
  });

  return possibleShapes;
};

const calculateWhiteBalanceAdjustments = (
  shapes: SetShape[]
): [number, number, number] => {
  const [totR, totG, totB] = shapes.reduce(
    ([r, g, b], s) => {
      return [
        r + (s.meanOutside?.[0] ?? 0),
        g + (s.meanOutside?.[1] ?? 0),
        b + (s.meanOutside?.[2] ?? 0),
      ];
    },
    [0, 0, 0]
  );

  const aveR = totR / shapes.length;
  const aveG = totG / shapes.length;
  const aveB = totB / shapes.length;

  const aveGrey = (aveR + aveG + aveB) / 3;

  return [aveR - aveGrey, aveG - aveGrey, aveB - aveGrey];
};

const ratioFits = (width: number, height: number) => {
  const ratio = width > height ? width / height : height / width;
  return ratio > minRatio && ratio < maxRatio;
};

const filterActualShapes = (shapes: SetShape[]): SetShape[] =>
  shapes.filter((shape) => {
    return shapes.every((otherShape) => {
      if (shape === otherShape) {
        return true;
      }

      let pointX = shape.contour.data32S[0];
      let pointY = shape.contour.data32S[1];

      if (
        cv.pointPolygonTest(
          otherShape.contour,
          new cv.Point(pointX, pointY),
          false
        ) > 0
      ) {
        return false;
      }

      return true;
    });
  });
