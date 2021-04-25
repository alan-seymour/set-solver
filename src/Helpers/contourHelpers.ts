import cv from "@techstark/opencv-js";

export const growContour = (contour: cv.Mat, pixels: number): cv.Mat => {
  const dataLength = contour.data32S.length;
  const newContour = new cv.Mat(dataLength / 2, 2, cv.CV_32S);

  let prevPoint = getContourPoint(contour, 0);
  let point = getContourPoint(contour, 2);
  let nextPoint = getContourPoint(contour, 4);

  for (let i = 6; i < dataLength + 6; i += 2) {
    const dist = getDistVector(prevPoint, nextPoint);

    if (dist[0] !== 0 || dist[1] !== 0) {
      const facing = getNormalOrtho(dist);

      newContour.data32S[i % dataLength] = Math.floor(
        point[0] + pixels * facing[0]
      );
      newContour.data32S[(i + 1) % dataLength] = Math.floor(
        point[1] + pixels * facing[1]
      );
    }

    prevPoint = point;
    point = nextPoint;
    nextPoint = getContourPoint(contour, i % dataLength);
  }

  return newContour;
};

export const getContourPoint = (contour: cv.Mat, doubledIndex: number) => [
  contour.data32S[doubledIndex],
  contour.data32S[doubledIndex + 1],
];

export const getNormalOrtho = (p: [number, number]): [number, number] => {
  const length = Math.sqrt(p[0] ** 2 + p[1] ** 2);
  return [p[1] / length, -p[0] / length];
};

export const getDistVector = (p0: number[], p1: number[]): [number, number] => {
  return [p1[0] - p0[0], p1[1] - p0[1]];
};
