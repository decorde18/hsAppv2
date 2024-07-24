import styled from 'styled-components';
import { useGameContext } from '../contexts/GameContext';

const Background = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  width: 75%;
  height: 75%;
  border-radius: 1.2rem;
  background-color: var(--color-grey-0);
  box-shadow: var(--color-brand-100) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  /* width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column; */
`;
const Title = styled.div`
  display: inline-block;
  text-align: center;
  margin-top: 1rem;
`;
const Body = styled.div`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const Footer = styled.div`
  flex: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CloseBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: transparent;
  border: none;
`;
const CancelBtn = styled.button`
  background-color: var(--color-red-700);
  color: var(--color-red-100);
  width: 15rem;
  height: 4.5rem;
  margin: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 2rem;
  cursor: pointer;
`;
const SaveBtn = styled.button`
  background-color: var(--color-brand-200);
  color: var(--color-brand-50);
  width: 15rem;
  height: 4.5rem;
  margin: 1rem;
  margin: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 2rem;
  cursor: pointer;
`;

function ModalStoppages() {
  const { setModalOpen } = useGameContext();
  function closeModal() {
    setModalOpen(false);
  }
  return (
    <Background>
      <Container>
        <CloseBtn>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '2.5rem',
              cursor: 'pointer',
            }}
            onClick={closeModal}
          >
            X
          </button>
        </CloseBtn>
        <Title>This is the MOdal</Title>
        <Body>Here are all the questions</Body>
        <Footer>
          <CancelBtn onClick={closeModal}>Cancel</CancelBtn>
          <SaveBtn>Save</SaveBtn>
        </Footer>
      </Container>
    </Background>
  );
}

export default ModalStoppages;