import cv from "@techstark/opencv-js";

/**
 * Convert an image to a slightly blurred grey scale image
 * @param image a colour image
 * @returns
 */
export const makeGreyImage = (image: cv.Mat): cv.Mat => {
  const blurred = new cv.Mat();
  const grey = new cv.Mat();

  cv.GaussianBlur(image, blurred, new cv.Size(5, 5), cv.BORDER_DEFAULT);

  cv.cvtColor(blurred, grey, cv.COLOR_BGR2GRAY);

  blurred.delete();

  return grey;
};
