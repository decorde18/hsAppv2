import styled from 'styled-components';

const defaultAnimationValues = {
  size: '15rem',
};

export const StyledInput = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  width: ${(props) => props.size};
`;

const Input = ({ size = defaultAnimationValues.size, register, ...props }) => {
  return <StyledInput {...register} size={size} {...props} />;
};

export default Input;
