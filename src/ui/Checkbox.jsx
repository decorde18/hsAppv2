import styled from 'styled-components';

const defaultAnimationValues = {
  size: 'medium',
};

const Input = styled.input`
  accent-color: var(--color-brand-500);
  height: ${(props) =>
    props.size === 'large'
      ? '2.4rem'
      : props.size === 'small'
      ? '1.4rem'
      : '1.8rem'};
  width: ${(props) =>
    props.size === 'large'
      ? '2.4rem'
      : props.size === 'small'
      ? '1.4rem'
      : '1.8rem'};
  /* height: ${(medium) => '2rem'};
  width: ${(medium) => '2rem'}; */
`;

const Checkbox = ({
  label,
  checked,
  onChange,
  size = defaultAnimationValues.size,
  ...props
}) => {
  return (
    <div>
      <Input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        size={size}
        {...props}
      />
      {label && <label>{label}</label>}
    </div>
  );
};

export default Checkbox;
