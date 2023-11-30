import styled from 'styled-components';
import Button from './Button';
import Heading from './Heading';

const StyledConfirmCancel = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

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

function ConfirmCancel({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmCancel>
      <Heading as="h3">Cancel {resourceName}</Heading>
      <p>Are you sure you want to cancel this {resourceName}?</p>

      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          No
        </Button>
        <Button variation="danger" disabled={disabled} onClick={onConfirm}>
          Yes
        </Button>
      </div>
    </StyledConfirmCancel>
  );
}

export default ConfirmCancel;
