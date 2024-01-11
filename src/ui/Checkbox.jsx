import styled, { css } from 'styled-components';

const Input = styled.input`
  accent-color: var(--color-brand-500);
  height: ${(props) => (props.$small ? '1.4rem' : '1.8rem')};
  width: ${(props) => (props.$small ? '1.4rem' : '1.8rem')};
  /* height: ${(medium) => '2rem'};
  width: ${(medium) => '2rem'}; */
`;

const Checkbox = ({ label, checked, onChange, ...props }) => {
  return (
    <div>
      <Input type="checkbox" checked={checked} onChange={onChange} {...props} />
      <label>{label}</label>
    </div>
  );
};

// Checkbox.defaultProps = {
//   variation: 'primary',
//   size: 'medium',
// };
export default Checkbox;
