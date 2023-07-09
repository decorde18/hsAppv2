import { styled } from 'styled-components';

const StyledButton = styled.button`
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
`;
Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
};
// .primary {
//   font-weight: 700;
//   background-color: var(--color-brand--2);
//   color: var(--color-dark--1);
// }

// .back {
//   font-weight: 600;
//   background: none;
//   border: 1px solid currentColor;
// }

// .position {
//   font-weight: 700;
//   position: absolute;
//   z-index: 1000;
//   font-size: 1.4rem;
//   bottom: 4rem;
//   left: 50%;
//   transform: translateX(-50%);
//   background-color: var(--color-brand--2);
//   color: var(--color-dark--1);
//   box-shadow: 0 0.4rem 1.2rem rgba(36, 42, 46, 0.16);
// }

// .nav {
//   border-radius: 100px;
//   background-color: var(--color-dark--2);
//   padding-top: 0.5rem;
//   font-size: medium;
// }
// .sideNav {
//   background-color: var(--color-light--1);
//   font-size: small;
//   color: var(--color-dark--2);
//   border-radius: 8px;
//   width: 90%;
//   font-weight: 600;
// }

function Button({ children, onClick, type }) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}

export default Button;
