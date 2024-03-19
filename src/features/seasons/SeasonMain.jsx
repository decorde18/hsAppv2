import styled from 'styled-components';

import { useState } from 'react';

import ButtonGroup from '../../ui/ButtonGroup';
import SeasonsAllTime from './SeasonsAllTime';
import SeasonOverview from './SeasonOverview';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
function SeasonMain() {
  const [tableData, setTableData] = useState('Season');

  function handleButtonGroupChange(e) {
    setTableData(e.target.name);
  }
  return (
    <>
      <StyledDiv>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={tableData}
          onChange={handleButtonGroupChange}
        />

        {/* <AddPlayer /> */}
      </StyledDiv>
      {tableData === 'Season' ? <SeasonOverview /> : <SeasonsAllTime />}
    </>
  );
}

export default SeasonMain;
