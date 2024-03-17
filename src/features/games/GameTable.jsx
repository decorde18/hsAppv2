import styled from 'styled-components';

import GameTableSeasons from './GameTableSeasons';
import GameTableAllTime from './GameTableAllTime';

// import AddPlayer from './AddPlayer';

import { useState } from 'react';
import ButtonGroup from '../../ui/ButtonGroup';
const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function GameTable() {
  const [GameTableData, setGameTableData] = useState('Season');
  const [filteredCount, setFilteredCount] = useState();

  function handleButtonGroupChange(e) {
    setGameTableData(e.target.name);
  }

  return (
    <>
      <StyledDiv>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={GameTableData}
          onChange={handleButtonGroupChange}
        />
        <div>{filteredCount} games</div>
        {/* <AddPlayer /> */}
      </StyledDiv>
      {GameTableData === 'Season' ? (
        <GameTableSeasons setFilteredCount={setFilteredCount} />
      ) : (
        <GameTableAllTime setFilteredCount={setFilteredCount} />
      )}
    </>
  );
}
export default GameTable;
