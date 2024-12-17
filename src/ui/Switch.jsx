import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: auto;
`;

const Button = styled.div`
  position: relative;
  width: ${({ size }) =>
    size === 'large' ? '6rem' : size === 'small' ? '3rem' : '4rem'};
  height: ${({ size }) =>
    size === 'large' ? '3rem' : size === 'small' ? '1.5rem' : '2rem'};
  background: ${({ disabled }) =>
    disabled ? 'var(--color-grey-100)' : 'var(--color-grey-200)'};
  border-radius: 3.2rem;
  padding: 4px;
  transition: 300ms ease-in-out;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

  &:before {
    content: '';
    position: absolute;
    width: ${({ size }) =>
      size === 'large' ? '2.5rem' : size === 'small' ? '1rem' : '1.5rem'};
    height: ${({ size }) =>
      size === 'large' ? '2.5rem' : size === 'small' ? '1rem' : '1.5rem'};
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: white;
    transform: translate(0, -50%);
    transition: 300ms ease-in-out;
  }
`;

const Input = styled.input`
  opacity: 0;

  &:checked + ${Button} {
    background-color: var(--color-brand-500);

    &:before {
      transform: ${({ size }) =>
        size === 'large'
          ? 'translate(3rem, -50%)'
          : size === 'small'
          ? 'translate(1.2rem, -50%)'
          : 'translate(1.7rem, -50%)'};
    }
  }

  &:disabled + ${Button} {
    background-color: var(--color-grey-300);

    &:before {
      background: var(--color-grey-200);
    }
  }
`;

export default function Switch({
  checked,
  onChange,
  name,
  disabled,
  size = 'medium',
}) {
  return (
    <Label
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
    >
      <Input
        checked={checked}
        type="checkbox"
        onChange={onChange}
        name={name}
        disabled={disabled}
        size={size}
      />
      <Button size={size} disabled={disabled} />
    </Label>
  );
}
