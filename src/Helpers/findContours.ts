import cv from "@techstark/opencv-js";

/**
 * Find the contours in a grey scale image
 * @param image a greyscale image
 * @returns
 */
export const findContours = (image: cv.Mat): cv.MatVector => {
  const imageThreshold = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.adaptiveThreshold(
    image,
    imageThreshold,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    7,
    2
  );
  cv.findContours(
    imageThreshold,
    contours,
    hierarchy,
    cv.RETR_TREE,
    cv.CHAIN_APPROX_SIMPLE
  );

  imageThreshold.delete();
  hierarchy.delete();
  return contours;
};
