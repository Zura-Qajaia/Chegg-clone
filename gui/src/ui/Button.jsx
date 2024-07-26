import styled, { css } from "styled-components";

const sizes = {
  small: css`
    padding: 4px 22px;
    font-size: 14px;
  `,
  medium: css`
    padding: 8px 16px;
    font-size: 14px;
  `,
  large: css`
    padding: 12px 24px;
    font-size: 16px;
  `,
};

const variants = {
  primary: css`
    background-color: blue;
    color: white;
    border: none;

    &:hover {
      background-color: darkblue;
    }
  `,
  secondary: css`
    background-color: orangered;
    color: white;
    border-radius: 14px;
    box-shadow: 9px 9px 20px 0px gray;
    border: none;

    &:hover {
      background-color: red;
    }
  `,
};

const Button = styled.button`
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  /* Apply size styles */
  ${({ size }) => sizes[size] || sizes.medium}

  /* Apply variant styles */
  ${({ variant }) => variants[variant] || variants.primary}
`;

export default Button;
