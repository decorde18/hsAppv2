import styled, { css } from 'styled-components';

const values = {
  true: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
  `,
  false: css``,
};

const StyledButtonChecked = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  cursor: pointer;
  ${(props) => values[props.value]}
  &:focus {
    outline: 2px solid var(--color-brand-600);
    outline-offset: -1px;
  }
  &:hover {
    color: var(--color-brand-50);
    background-color: var(--color-brand-700);
  }
`;

function ButtonChecked(props) {
  return (
    <StyledButtonChecked value={props.value} onClick={props.onClick}>
      <label>
        <input
          type="checkbox"
          hidden
          checked={props.value}
          onChange={() => {}}
        />
        <span>{props.label}</span>
      </label>
    </StyledButtonChecked>
  );
}
export default ButtonChecked;
