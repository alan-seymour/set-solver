import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputImage = styled.img`
  display: none;
`;

export const OutputCanvas = styled.canvas`
  border-radius 10px;
  max-width: calc(100% - 24px);
  max-height: calc(100% - 24px);
`;
