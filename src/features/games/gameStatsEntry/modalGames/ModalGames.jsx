import styled from 'styled-components';

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

function ModalGames() {
  return (
    <Background>
      <ModalStoppages />
    </Background>
  );
}

export default ModalGames;
