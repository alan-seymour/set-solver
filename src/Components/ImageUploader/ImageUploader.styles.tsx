import styled from "styled-components";

export const Wrapper = styled.div``;

export const UploadButton = styled.button`
  background-image: linear-gradient(
    to right,
    #ff512f 0%,
    #f09819 51%,
    #ff512f 100%
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

export const UploadInput = styled.input`
  display: none;
`;
