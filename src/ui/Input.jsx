import styled from 'styled-components';

const defaultAnimationValues = {
  size: 15,
};

export const StyledInput = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  width: ${(props) => props.size}rem;
`;

const Input = ({ size = defaultAnimationValues.size, ...props }) => {
  return (
    <div>
      <StyledInput size={size} {...props} />
    </div>
  );
};

export default Input;
