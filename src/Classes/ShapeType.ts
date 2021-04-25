import { HSL } from "color-convert/conversions";

export type Shape = "DIAMOND" | "OVAL" | "SQUIGGLE";
export type ShapeColour = "RED" | "PURPLE" | "GREEN";
export type Shading = "OPEN" | "SOLID" | "STRIPED";

export class ShapeType {
  shape?: Shape;
  colour?: ShapeColour;
  shading?: Shading;

  constructor(shape = undefined, colour = undefined, shading = undefined) {
    this.shape = shape;
    this.colour = colour;
    this.shading = shading;
  }

  setShapeType(shapeExtent: number) {
    if (shapeExtent < 0.666) {
      this.shape = "DIAMOND";
    } else if (shapeExtent < 0.81) {
      this.shape = "SQUIGGLE";
    } else {
      this.shape = "OVAL";
    }
  }

  setShapeColour(contourColour: HSL) {
    const hue = contourColour[0];

    if (hue >= 340 || hue <= 15) {
      this.colour = "RED";
    } else if (hue >= 240 && hue <= 300) {
      this.colour = "PURPLE";
    } else if (hue >= 60 && hue <= 180) {
      this.colour = "GREEN";
    } else {
      //white balance fix should make this irrelevant
      this.colour = "PURPLE";
    }
  }

  setShapeShading(insideColour: HSL, outsideColour: HSL) {
    let fallOff = outsideColour[2] - insideColour[2];

    if (fallOff <= 4) {
      this.shading = "OPEN";
    } else if (fallOff < 21) {
      this.shading = "STRIPED";
    } else {
      this.shading = "SOLID";
    }
  }

  equals(other: ShapeType) {
    return (
      this.colour === other.colour &&
      this.shading === other.shading &&
      this.shape === other.shape
    );
  }

  toString() {
    return `${this.colour} ${this.shading} ${this.shape}`;
  }
}
