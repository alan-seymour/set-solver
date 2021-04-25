import React, { useCallback, useRef } from "react";
import { UploadButton, UploadInput, Wrapper } from "./ImageUploader.styles";

interface Props {
  onUpload: (image: string) => void;
}

export const ImageUploader = ({ onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ?? [];
      if (files.length > 0) {
        onUpload(URL.createObjectURL(files[0]));
      }
    },
    [onUpload]
  );

  return (
    <Wrapper>
      <UploadInput
        ref={inputRef}
        id="file"
        type="file"
        accept="image/*"
        onChange={onChange}
      />
      <UploadButton onClick={() => inputRef.current?.click()}>
        Upload Image
      </UploadButton>
    </Wrapper>
  );
};
