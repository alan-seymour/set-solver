import React, { useRef } from "react";
import cv from "@techstark/opencv-js";
import { detectSetCards } from "../../Helpers/findCards";
import { findSets } from "../../Helpers/findSets";
import { drawSetOnImage } from "../../Helpers/annotateImage";
import { lineColours } from "../../Helpers/colours";
import { InputImage, OutputCanvas, Wrapper } from "./ImageProcessor.styles";

interface Props {
  imageUrl: string;
}

const resizeImage = (image: cv.Mat): cv.Mat => {
  const { width, height } = image.size();

  const maxFactor = Math.floor(Math.max(width, height) / 1000);

  const resized = new cv.Mat();

  if (maxFactor > 1) {
    cv.resize(
      image,
      resized,
      new cv.Size(Math.floor(width / maxFactor), Math.floor(height / maxFactor))
    );
    image.delete();
    return resized;
  }
  return image;
};

export const ImageProcessor = ({ imageUrl }: Props) => {
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputImgRef = useRef<HTMLImageElement>(null);

  const onImageLoadCallback = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (inputImgRef.current && outputCanvasRef.current) {
      const mat = cv.imread(inputImgRef.current);
      const resized = resizeImage(mat);
      const cards = detectSetCards(resized);
      const sets = findSets(cards);

      sets.forEach((set, i) => {
        drawSetOnImage(resized, set, lineColours[i]);
      });

      cv.imshow(outputCanvasRef.current, resized);
    }
  };

  return (
    <Wrapper>
      <InputImage
        src={imageUrl}
        onLoad={onImageLoadCallback}
        ref={inputImgRef}
        alt="Original Image"
      />
      <OutputCanvas ref={outputCanvasRef} />
    </Wrapper>
  );
};
