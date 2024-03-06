import styled from 'styled-components';
import Button from './Button';

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
`;
function ButtonGroup({ btnArray, defaultBtn, onChange }) {
  return (
    <StyledButtonGroup>
      {btnArray.map((btn, key) => (
        <Button
          name={btn}
          size="medium"
          variation={btn === defaultBtn ? 'primary' : 'secondary'}
          key={key}
          onClick={onChange}
        >
          {btn}
        </Button>
      ))}
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
