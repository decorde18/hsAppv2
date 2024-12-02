import styled from 'styled-components';

const StyledSelect = styled.select`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  border: 1px solid
    ${(props) =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: ${(props) =>
    props.type === 'light' ? 'var(--color-brand-50)' : 'var(--color-grey-0)'};
  background-color: ${(props) =>
    props.type === 'dark' ? 'var(--color-brand-500)' : 'var(--color-grey-0)'};
  color: ${(props) =>
    props.type === 'dark' ? 'var(--color-brand-50)' : 'var(--color-grey-700)'};
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  ${(props) => (props.width === 0 ? null : `width: ${props.width}rem`)};
`;
function Select({
  options,
  value,
  onChange,
  register,
  defaultValue,
  ...props
}) {
  return (
    <StyledSelect
      {...register}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      {...props}
    >
      {options.map((option) => (
        <option
          value={option.value}
          key={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
