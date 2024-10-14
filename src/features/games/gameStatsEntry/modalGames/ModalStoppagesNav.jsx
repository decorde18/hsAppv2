import styled from 'styled-components';
import Button from '../../../../ui/Button';
import { useGameContext } from '../../../../contexts/GameContext';

const Ul = styled.ul`
  width: 80%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  gap: 10rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;
const Flex = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

function ModalStoppagesNav({ changeStoppageType, stoppageTypes, changeTeam }) {
  const { gameDetails, setGameDetails, getGameTime, buttons } =
    useGameContext();
  const { stoppageStatus } = gameDetails;

  const team = ['Independence High', gameDetails.game.short_name];
  return (
    <>
      <Ul>
        <Flex>
          <li>
            {stoppageTypes.map((button) => (
              <Button
                key={button.id}
                name={button.type}
                size="large"
                variation={
                  stoppageStatus.event === button.type ? 'primary' : 'secondary'
                }
                onClick={changeStoppageType}
              >
                {button.type}
              </Button>
            ))}
          </li>
        </Flex>
      </Ul>
      {stoppageStatus?.event !== 'other' && (
        <Ul>
          <Flex>
            {team.map((button) => (
              <li key={button}>
                <Button
                  name={button}
                  size="large"
                  variation={
                    stoppageStatus.team === button ? 'primary' : 'secondary'
                  }
                  onClick={changeTeam}
                >
                  {button}
                </Button>
              </li>
            ))}
          </Flex>
        </Ul>
      )}
    </>
  );
}

export default ModalStoppagesNav;
