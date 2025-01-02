import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSelect = styled.select`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  border: 1px solid
    ${({ type }) =>
      type === 'white' || type === 'light'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: ${({ type }) =>
    type === 'light'
      ? 'var(--color-brand-50)'
      : type === 'dark'
      ? 'var(--color-brand-500)'
      : 'var(--color-grey-0)'};
  color: ${({ type }) =>
    type === 'dark' ? 'var(--color-brand-50)' : 'var(--color-grey-700)'};
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  ${({ width }) => (width ? `width: ${width}rem` : 'width: auto')};

  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }
`;

function Select({
  label,
  options,
  value,
  onChange,
  register,
  placeholder = 'Please select an option',
  // name,
  type = 'white',
  width = null,
  ...props
}) {
  const id = `select-${name || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <StyledSelect
        id={id}
        {...register}
        value={value}
        onChange={onChange}
        type={type}
        width={width}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
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
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  register: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.oneOf(['white', 'light', 'dark']),
  width: PropTypes.number,
  placeholder: PropTypes.string,
};

export default Select;
