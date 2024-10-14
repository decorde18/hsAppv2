import styled from 'styled-components';
import Button from '../../../../ui/Button';

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
  margin-bottom: 1.2rem;
  padding: 2rem;
  border-radius: 1rem;
  align-items: center;
`;
const ButtonDiv = styled.div`
  display: flex;
  gap: 5rem;
  /* justify-content: space-between; */
  padding: 2rem;
`;
//todo turn ModalGames into a component that is called by each of the mdals needed, it will provide the background --- or use Max dialoguw box modal leson 139
function PopUpConfirm({ title, message, confirmType, onClose, btnTypes }) {
  return (
    <Background>
      <MessageDiv>
        <h3>{title}</h3>
        <p>{message}</p>
        <ButtonDiv>
          <Button
            name={`cancelBtn-${confirmType}`}
            variation="danger"
            onClick={onClose}
          >
            {btnTypes === 'YesNo' ? 'No' : 'Cancel'}
          </Button>
          <Button
            name={`confirmBtn-${confirmType}`}
            variation="primary"
            onClick={onClose}
          >
            {btnTypes === 'YesNo' ? 'Yes' : 'OK'}
          </Button>
        </ButtonDiv>
      </MessageDiv>
    </Background>
  );
}

export default PopUpConfirm;
