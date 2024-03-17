import styled from 'styled-components';

import PlayerTableSeasons from './PlayerTableSeasons';
import PlayerTableAllTime from './PlayerTableAllTime';

import AddPlayer from './AddPlayer';

import { useState } from 'react';
import ButtonGroup from '../../ui/ButtonGroup';
const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function PlayerTable() {
  const [playerTableData, setPlayerTableData] = useState('Season');
  const [filteredCount, setFilteredCount] = useState();

  function handleButtonGroupChange(e) {
    setPlayerTableData(e.target.name);
  }

  return (
    <>
      <StyledDiv>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={playerTableData}
          onChange={handleButtonGroupChange}
        />
        <div>{filteredCount} players</div>
        <AddPlayer />
      </StyledDiv>
      {playerTableData === 'Season' ? (
        <PlayerTableSeasons setFilteredCount={setFilteredCount} />
      ) : (
        <PlayerTableAllTime setFilteredCount={setFilteredCount} />
      )}
    </>
  );
}
export default PlayerTable;
