import styled from 'styled-components';

import { useState } from 'react';

import ButtonGroup from '../../ui/ButtonGroup';
import SeasonsAllTime from './SeasonsAllTime';
import SeasonOverview from './SeasonOverview';
import Heading from '../../ui/Heading';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
`;
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.div`
  flex: 1;
  text-align: center;
  margin: 0;
`;

function SeasonMain() {
  const [tableData, setTableData] = useState('Season');
  const { currentSeason } = useCurrentSeason();

  function handleButtonGroupChange(e) {
    setTableData(e.target.name);
  }
  return (
    <Container>
      <TopRow>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={tableData}
          onChange={handleButtonGroupChange}
        />
        <Title>
          {tableData === 'Season' ? (
            <Heading as="h1" case="upper" location="center">
              {currentSeason.teamMascot} {currentSeason.season} season
            </Heading>
          ) : (
            <div>All- time do this </div>
          )}
        </Title>
      </TopRow>
      {tableData === 'Season' ? <SeasonOverview /> : <SeasonsAllTime />}
    </Container>
  );
}

export default SeasonMain;
