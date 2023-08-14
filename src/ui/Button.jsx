import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-500);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-500);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};
const types = {
  selected: css`
    background-color: var(--color-grey-0);
    color: var(--color-dark--2);
  `,
  sideNav: css`
    width: 100%;
    background-color: var(--color-grey-0);
    color: var(--color-brand--2);
    &:hover {
      color: var(--color-brand--1);
      font-weight: 700;
      background-color: var(--color-brand-500);
    }
  `,
};
const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  border-radius: 0.25rem;
  border-style: none;
  cursor: pointer;

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
  ${(props) => types[props.type]}
`;
Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
};
export default Button;
