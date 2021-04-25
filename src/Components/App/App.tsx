import React, { useState } from "react";
import { ImageProcessor } from "../ImageProcessor/ImageProcessor";
import { ImageUploader } from "../ImageUploader/ImageUploader";
import { Wrapper } from "./App.styles";

const App = () => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>();
  return (
    <Wrapper>
      <ImageUploader onUpload={(image) => setCurrentImageUrl(image)} />
      {currentImageUrl && <ImageProcessor imageUrl={currentImageUrl} />}
    </Wrapper>
  );
};

export default App;
