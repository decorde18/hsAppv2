import styled from 'styled-components';
import Button from '../../../../ui/Button';
import Heading from '../../../../ui/Heading';

import { useGameContext } from '../../../../contexts/GameContext';
import { buttons } from '../gameStatsEntryHelperFunctions';

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
`;
const Div1 = styled.div`
  padding: 0.5rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;
const Div2 = styled.div`
  display: flex;
  justify-content: space-between;
`;

function ActionButtons() {
  const { gameDataArrays, minorEventHandle, stoppageHandle } = useGameContext();
  const {
    minorEvents,
    game: { abbreviation: section },
  } = gameDataArrays;
  function handleClick(e) {
    e = e.target.closest('button').name;
    const category = buttons.find((button) => button.id === +e);
    if (category.section === 'stoppage') handleStoppage(category.type);
    else minorEventHandle.createMinorEvent(category);
  }
  function handleStoppage(type) {
    stoppageHandle.newStoppage(type);

    //   //todo discipline
    // todo weather
    //   //todo other
  }

  return (
    <Div>
      <div>
        <Heading>IHS</Heading>
        <Div1>
          {buttons
            .filter((button) => button.section === 'for')
            .map((button) => (
              <Button key={button.id} name={button.id} onClick={handleClick}>
                <Div2>
                  <span>{button.type}</span>
                  <span>{minorEvents.for[button.type].length}</span>
                </Div2>
              </Button>
            ))}
        </Div1>
      </div>
      <div>
        <Heading>STOPPAGES</Heading>
        <Div1>
          {buttons
            .filter((button) => button.section === 'stoppage')
            .map((button) => (
              <Button key={button.id} name={button.id} onClick={handleClick}>
                <Div2>{button.type}</Div2>
              </Button>
            ))}
        </Div1>
      </div>
      <div>
        <Heading>{section}</Heading>
        <Div1>
          {buttons
            .filter((button) => button.section === 'against')
            .map((button) => (
              <Button key={button.id} name={button.id} onClick={handleClick}>
                <Div2>
                  <span>{button.type}</span>
                  <span>{minorEvents.against[button.type].length}</span>
                </Div2>
              </Button>
            ))}
        </Div1>
      </div>
    </Div>
  );
}
export default ActionButtons;
