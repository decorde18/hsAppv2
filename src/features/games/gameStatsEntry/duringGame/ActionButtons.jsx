import styled from 'styled-components';
import Button from '../../../../ui/Button';
import Heading from '../../../../ui/Heading';

import { useContext, useEffect, useState } from 'react';
import { useGameContext } from '../../../../contexts/GameContext';

const buttons = [
  { id: 1, type: 'foul', section: 'for' },
  { id: 2, type: 'offside', section: 'for' },
  { id: 3, type: 'corner', section: 'for' },
  { id: 4, type: 'shots', section: 'for' },
  { id: 5, type: 'foul', section: 'against' },
  { id: 6, type: 'offside', section: 'against' },
  { id: 7, type: 'corner', section: 'against' },
  { id: 8, type: 'shots', section: 'against' },
  { id: 9, type: 'goal', section: 'stoppage' },
  { id: 10, type: 'discipline', section: 'stoppage' },
  { id: 11, type: 'weather', section: 'stoppage' },
  { id: 12, type: 'other', section: 'stoppage' },
];

const Div = styled.div`
  /* height: 100%;
  */
  display: flex;
  justify-content: space-between;
  /* flex-direction: column;  */
  border: 1px solid black;
  /* padding: 0.5rem; */
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

function ActionButtons({ updateStates }) {
  const {
    game: { abbreviation: section },
    minorEventCategories,
  } = useGameContext();

  useEffect(() => {
    //todo create a modal open on load if there is no end time for stoppage
  }, []);

  function handleClick(e) {
    e = e.target.closest('button').name;
    const category = buttons.find((button) => button.id === +e);
    if (category.section === 'stoppage') handleStoppage(category.type);
    else updateStates({ state: 'minorEventCategories', data: category });
  }
  function handleStoppage(type) {
    //type is which kind of stopppage
    //create a pop up modal that doesn't close without buttons
    // todo goal
    //todo discipline
    // todo weather
    //todo other
    //todo close modal by adding end time to stoppage
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
                  <span>{minorEventCategories.for[button.type].length}</span>
                </Div2>
              </Button>
            ))}
        </Div1>
      </div>
      <div>
        <Heading>STOPPAGE</Heading>
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
                  <span>
                    {minorEventCategories.against[button.type].length}
                  </span>
                </Div2>
              </Button>
            ))}
        </Div1>
      </div>
    </Div>
  );
}
export default ActionButtons;
