import cv from "@techstark/opencv-js";
import convert from "color-convert";
import { HSL, RGB } from "color-convert/conversions";
import { unsafeCoerce } from "fp-ts/lib/function";

export const white = [255, 255, 255, 255];
export const black = [0, 0, 0, 255];
export const red = [255, 0, 0, 255];
export const green = [0, 255, 0, 255];
export const blue = [0, 0, 255, 255];
export const orange = [255, 128, 0, 255];
export const cyan = [0, 255, 255, 255];
export const magenta = [255, 0, 255, 255];

export const lineColours = [magenta, red, green, blue, orange, cyan];

export const meanRGBToHSL = (rgb: cv.Scalar): HSL =>
  convert.rgb.hsl(unsafeCoerce<cv.Scalar, RGB>(rgb));
