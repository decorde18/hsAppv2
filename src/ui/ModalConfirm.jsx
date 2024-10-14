import styled from 'styled-components';
import Button from './Button';
import Heading from './Heading';

const StyledModalConfirm = styled.div`
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
function ModalConfirm({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
  confirmType,
}) {
  return (
    <StyledModalConfirm>
      <Heading as="h3" case="upper">
        {confirmType} {resourceName}
      </Heading>
      {confirmType === 'add another' ? (
        <p>Would you like to add another {resourceName}?</p>
      ) : confirmType === 'create' ? (
        <p>There are no {resourceName}. Would you like to create them?</p>
      ) : (
        <p>
          Are you sure you want to {confirmType} this {resourceName}?
        </p>
      )}
      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          No
        </Button>
        <Button
          variation="danger"
          disabled={disabled}
          onClick={() => {
            //close modal
            onCloseModal();
            onConfirm();
          }}
        >
          Yes
        </Button>
      </div>
    </StyledModalConfirm>
  );
}

export default ModalConfirm;
