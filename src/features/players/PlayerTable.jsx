import styled from 'styled-components';

import PlayerTableSeasons from './PlayerTableSeasons';
import PlayerTableAllTime from './PlayerTableAllTime';

import AddPlayer from './AddPlayer';

import { useState } from 'react';
import ButtonGroup from '../../ui/ButtonGroup';

const Container = styled.div`
  display: grid;
  grid-template-rows: 4.5rem 1fr;
  height: 100%;
  /* background-color: red; */
`;
const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function PlayerTable() {
  const [tableData, setTableData] = useState('Season');
  const [filteredCount, setFilteredCount] = useState();

  function handleButtonGroupChange(e) {
    e.preventDefault();
    setTableData(e.target.name);
  }

  return (
    <Container>
      <StyledDiv>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={tableData}
          onChange={handleButtonGroupChange}
        />
        <div>{filteredCount} players</div>
        <AddPlayer />
      </StyledDiv>
      {tableData === 'Season' ? (
        <PlayerTableSeasons setFilteredCount={setFilteredCount} />
      ) : (
        <PlayerTableAllTime setFilteredCount={setFilteredCount} />
      )}
    </Container>
  );
}
export default PlayerTable;
