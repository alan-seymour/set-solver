import React, { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";
import { detectSetCards } from "../../Helpers/findCards";
import { findSets } from "../../Helpers/findSets";
import { drawSetOnImage, drawShapeOnImage } from "../../Helpers/annotateImage";
import { lineColours } from "../../Helpers/colours";
import {
  DebugButton,
  InputImage,
  OutputCanvas,
  Wrapper,
} from "./ImageProcessor.styles";
import { SetCard } from "../../Classes/SetCard";
import { subtractVector, vectorLength } from "../../Helpers/vectorHelpers";

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
  const [imageReadyToProcess, setImageReadyToProcess] = useState(false);
  const [debug, setDebug] = useState(false);
  const [cards, setCards] = useState<SetCard[]>([]);
  const [resized, setResized] = useState<cv.Mat>();
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageReadyToProcess(false);
    setResized(undefined);
    setCards([]);
    setDebug(false);
  }, [imageUrl]);

  useEffect(() => {
    if (inputImgRef.current && imageReadyToProcess) {
      const mat = cv.imread(inputImgRef.current);
      const resized = resizeImage(mat);
      const cards = detectSetCards(resized);
      setCards(cards);
      setResized(resized);
    }
  }, [inputImgRef, imageReadyToProcess]);

  useEffect(() => {
    if (imageReadyToProcess && cards && outputCanvasRef.current && resized) {
      const drawing = resized.clone();
      if (!debug) {
        const sets = findSets(cards);
        sets.forEach((set, i) => {
          drawSetOnImage(drawing, set, lineColours[i]);
        });
      } else {
        cards.forEach((card, j) => {
          card.shapes.forEach((shape) => {
            drawShapeOnImage(drawing, shape);
          });
        });
      }

      cv.imshow(outputCanvasRef.current, drawing);
    }
  }, [imageReadyToProcess, outputCanvasRef, resized, cards, debug]);

  const onImageLoadCallback = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setImageReadyToProcess(true);
  };

  const onCanvasClick = (e: React.MouseEvent) => {
    if (outputCanvasRef.current) {
      const elemTop =
        outputCanvasRef.current.clientTop + outputCanvasRef.current.offsetTop;
      const elemLeft =
        outputCanvasRef.current.clientLeft + outputCanvasRef.current.offsetLeft;

      const clickX = e.pageX - elemLeft;
      const clickY = e.pageY - elemTop;

      const shapes = cards.flatMap((c) => c.shapes);
      shapes.sort((a, b) => {
        const distA = vectorLength(
          subtractVector({ x: clickX, y: clickY }, a.minRect.center)
        );
        const distB = vectorLength(
          subtractVector({ x: clickX, y: clickY }, b.minRect.center)
        );
        return distA < distB ? -1 : 1;
      });

      console.log(shapes[0]);
    }
  };

  return (
    <>
      <Wrapper>
        <InputImage
          src={imageUrl}
          onLoad={onImageLoadCallback}
          ref={inputImgRef}
          alt="Original Image"
        />
        <OutputCanvas ref={outputCanvasRef} onClick={onCanvasClick} />
      </Wrapper>
      {resized && cards && (
        <DebugButton onClick={() => setDebug(!debug)}>
          {debug ? "Show Sets" : "Show Debug"}
        </DebugButton>
      )}
    </>
  );
};
