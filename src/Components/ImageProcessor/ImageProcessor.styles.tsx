import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: min(calc(100vh - 160px), calc(100% - 24px));
  max-width: calc(min(100%, 100vw) - 24px);
`;

export const InputImage = styled.img`
  display: none;
`;

export const OutputCanvas = styled.canvas`
  border-radius 10px;
  max-width: calc(100% - 24px);
  max-height: calc(100% - 24px);
`;

export const DebugButton = styled.button`
  background-image: linear-gradient(
    to right,
    #314755 0%,
    #26a0da 51%,
    #314755 100%
  );
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
  font-size: 16px;
  border: 0;

  &:hover {
    background-position: right center;
    text-decoration: none;
    box-shadow: 0 0 0px #eee;
  }
`;
