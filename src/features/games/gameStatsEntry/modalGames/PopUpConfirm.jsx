import styled from 'styled-components';
import Button from '../../../../ui/Button';
import PropTypes from 'prop-types';

const Background = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MessageDiv = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background-color: var(--color-grey-100);
  padding: 2rem;
  border-radius: 1rem;
  align-items: center;
  text-align: center;
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem 0;
`;
// EXAMPLE FOR CALLING CODE
//   function handleModalAction(id, actionType) {
//     // Handle actions based on modal id and button action
//     console.log(`Modal ${id} triggered action ${actionType}`);
//     if (id === 'subsConfirm' && actionType === 'confirmBtn') {
//       console.log('Substitutions confirmed!');
//     } else if (id === 'deletePlayer' && actionType === 'confirmBtn') {
//       console.log('Player deleted!');
//     }
//     handleCloseModal();
//   }
//   function handleCloseModal() {
//     setOpenModal(null); // Close any open modal
//   }

// <PopUpConfirm
//   id="deletePlayer"
//   title="Delete Player"
//   message="Are you sure you want to delete this player?"
//   buttonType="CancelOk"   //--buttonPresets  see below in code for types or create custom buttons --see below code
//   onClose={handleCloseModal}
//   onAction={handleModalAction}
// />;
function PopUpConfirm({
  id, // Unique identifier for the modal
  title,
  message,
  buttonType = 'YesNo',
  customButtons = [],
  onClose,
  onAction, // Callback for specific actions
  className,
  children,
}) {
  // Button presets
  const buttonPresets = {
    YesNo: [
      { label: 'No', variation: 'danger', name: 'cancelBtn' },
      { label: 'Yes', variation: 'primary', name: 'confirmBtn' },
    ],
    CancelOk: [
      { label: 'Cancel', variation: 'danger', name: 'cancelBtn' },
      { label: 'OK', variation: 'primary', name: 'confirmBtn' },
    ],
    CloseOnly: [{ label: 'Close', variation: 'primary', name: 'closeBtn' }],
  };

  // Resolve buttons
  const buttons = customButtons.length
    ? customButtons
    : buttonPresets[buttonType] || [];

  return (
    <Background
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <MessageDiv className={className}>
        {title && <h3 id="modal-title">{title}</h3>}
        {message && <p id="modal-message">{message}</p>}
        {children /* Custom content */}
        <ButtonDiv>
          {buttons.map(({ label, variation, onClick, name }, index) => (
            <Button
              key={index}
              name={name}
              variation={variation}
              onClick={() => {
                onClick?.(id); // Pass the id to the button's onClick
                onAction?.(id, name); // Notify parent component of action
                onClose?.();
              }}
            >
              {label}
            </Button>
          ))}
        </ButtonDiv>
      </MessageDiv>
    </Background>
  );
}

PopUpConfirm.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonType: PropTypes.oneOf(['YesNo', 'CancelOk', 'CloseOnly']),
  customButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variation: PropTypes.string, // E.g., 'primary', 'danger'
      onClick: PropTypes.func,
      name: PropTypes.string,
    })
  ),
  onClose: PropTypes.func,
  onAction: PropTypes.func, // Callback for specific modal actions
  className: PropTypes.string,
  children: PropTypes.node,
};
export default PopUpConfirm;

// EXAMPLE CUSTOM BUTTONS
{
  /* <PopUpConfirm
  title="Custom Buttons"
  message="Choose an action:"
  customButtons={[
    {
      label: 'Dismiss',
      variation: 'danger',
      name: 'dismissBtn',
      onClick: handleDismiss,
    },
    {
      label: 'Retry',
      variation: 'primary',
      name: 'retryBtn',
      onClick: handleRetry,
    },
  ]}
  onClose={handleClose}
/>; */
}

// EXAMPLE CUSTOM BUTTONS WITH CONTENT
// <PopUpConfirm
//   title="Player Info"
//   message="Modify player details below:"
//   buttonType="CancelOk"
//   onClose={handleClose}
// >
//   <form onSubmit={handleSubmit}>
//     <label>
//       Name: <input type="text" value={playerName} onChange={handleChange} />
//     </label>
//   </form>
// </PopUpConfirm>;
