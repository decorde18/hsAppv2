import styled, { css } from 'styled-components';

const sizes = {
  xsmall: css`
    font-size: 1rem;
    padding: 0.2rem 0.6rem;
    text-transform: uppercase;
    font-weight: 500;
    text-align: center;
    min-width: 8rem;
    min-height: 3.5rem;
  `,
  small: css`
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
    min-width: 10rem;
    min-height: 4.5rem;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
    min-width: 10rem;
    min-height: 4.5rem;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
  xlarge: css`
    padding: 1.2rem 2.4rem;
    font-weight: 500;

    width: 15rem;
    /* height: 4.5rem;
    margin: 1rem;
    margin: 1rem;
    border: none;
    border-radius: 8px; */
    font-size: 2rem;
    cursor: pointer;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-500);
    border: 1px solid var(--color-brand-500);
  `,
  secondary: css`
    color: var(--color-grey-500);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    &:hover {
      color: var(--color-brand--1);
      font-weight: 700;
      background-color: var(--color-brand-500);
    }
  `,
  tertiary: css`
    color: var(--color-grey-500);
    background: var(--color-grey-50);
    border: 1px solid var(--color-grey-200);
    &:hover {
      color: var(--color-brand--1);
      font-weight: 700;
      background-color: var(--color-brand-500);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  back: css`
    font-weight: 600;
    background: none;
    border: 1px solid currentColor;
  `,
};
const types = {
  selected: css`
    &:hover {
      background-color: var(--color-brand-700);
      font-weight: 700;
      font-size: 1.5rem;
    }
  `,
  fullWidth: css`
    width: 100%;
    /* background-color: var(--color-grey-0);
    color: var(--color-brand--2); */
  `,
};
const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  padding: 0.5rem 1rem;

  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;

  border-style: none;
  cursor: pointer;

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
  ${(props) => types[props.type]}
`;
Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
  type: '',
};
export default Button;
