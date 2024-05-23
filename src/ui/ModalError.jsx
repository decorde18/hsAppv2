import styled from 'styled-components';
import Button from './Button';
import Heading from './Heading';

const StyledModalError = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 3rem;
  transition: all 0.5s;
  max-width: 95%;
  max-height: 95%;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;
function ModalError({ onConfirm, disabled, onCloseModal }) {
  console.log('oops');
  return (
    <Overlay>
      <StyledModalError>
        <Heading as="h3"></Heading>(
        <p>Please enter time as min:sec (ie 23:25)</p>)
        <div>
          <Button variation="danger" disabled={disabled} onClick={onConfirm}>
            OK
          </Button>
        </div>
      </StyledModalError>
    </Overlay>
  );
}

export default ModalError;
