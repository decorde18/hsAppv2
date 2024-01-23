import styled from 'styled-components';

import Row from '../../../ui/Row';
import { flattenObject } from '../../../utils/helpers';
import Menus from '../../../ui/Menus';
import Button from '../../../ui/Button';

const StyledButton = styled.div`
  display: inline-block;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-light--2);
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  vertical-align: middle;
  width: 100%;
  padding: 0.15rem;
  margin: 0.2rem;
  text-align: center;
  border-radius: 0.5rem;
`;
const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
`;
const StyledButtonMain = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  flex: 1;
`;
const StyledButtonAux = styled.div`
  width: 4rem;
`;
const StyledButtonAuxSmall = styled.div`
  width: 2rem;
`;

function GamePlayerRow({
  data,
  handleOnToggle,
  status,
  updateStatus,
  disabled,
}) {
  const { playerS, playerG } = data;

  function handleClick(newStatus) {
    updateStatus(status, newStatus, playerG.player);
  }

  return (
    <Row type="horizontal" justify="space between">
      <StyledButton>
        <StyledButtonRow>
          <StyledButtonMain
            onClick={() => handleOnToggle(status, playerG.player)}
            disabled={disabled}
          >
            <StyledButtonAux>{playerS.number}</StyledButtonAux>
            <div>{playerS.fullname}</div>
          </StyledButtonMain>
          <StyledButtonAux>
            <Menus.Menu>
              <Menus.Toggle id={playerG.player} />
              <Menus.List id={playerG.player}>
                {status !== 'notDressed' && (
                  <Menus.Button onClick={() => handleClick('notDressed')}>
                    Not Dressed
                  </Menus.Button>
                )}
                {status !== 'injured' && (
                  <Menus.Button onClick={() => handleClick('injured')}>
                    Injured
                  </Menus.Button>
                )}
                {status !== 'unavailable' && (
                  <Menus.Button onClick={() => handleClick('unavailable')}>
                    Unavailable
                  </Menus.Button>
                )}
              </Menus.List>
            </Menus.Menu>
          </StyledButtonAux>
        </StyledButtonRow>
      </StyledButton>
      <div></div>
      <div />
    </Row>
  );
}

export default GamePlayerRow;
