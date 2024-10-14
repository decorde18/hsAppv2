import styled from 'styled-components';
import { useGameContext } from '../../../../contexts/GameContext';
import ModalStoppages from './ModalStoppages';

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
const Container = styled.div`
  width: 75%;
  height: 75%;
  border-radius: 1.2rem;
  background-color: var(--color-grey-0);
  box-shadow: var(--color-brand-100) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
`;

function ModalGames() {
  return (
    <Background>
      {/* <Container> */}
      <ModalStoppages />
      {/* </Container> */}
    </Background>
  );
}

export default ModalGames;
