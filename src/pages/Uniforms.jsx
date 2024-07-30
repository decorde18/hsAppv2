import styled from 'styled-components';
import ButtonGroup from '../ui/ButtonGroup';

import { useState } from 'react';

import UniformSeasons from '../features/uniforms/UniformSeasons';
import UniformsMain from '../features/uniforms/UniformsMain';
import UniformJerseys from '../features/uniforms/UniformJerseys';
import UniformSeasonPlayers from '../features/uniformsOLD/UniformSeasonPlayers';

const Container = styled.div`
  display: grid;
`;

const pages = [
  { page: 'All Uniforms', label: <UniformsMain /> },
  { page: 'Season Uniforms', label: <UniformSeasons /> },
  { page: 'Season Jerseys', label: <UniformJerseys /> },
  { page: 'Assigned', label: <UniformSeasonPlayers /> },
];

function Uniforms() {
  const [selectedBtn, setSelectedBtn] = useState('Season Uniforms');

  function handleButtonGroupChange(e) {
    setSelectedBtn(e.target.name);
  }
  return (
    <Container>
      <ButtonGroup
        btnArray={pages.map((page) => page.page)}
        defaultBtn={selectedBtn}
        onChange={handleButtonGroupChange}
      />

      {pages.find((page) => page.page === selectedBtn).label}
    </Container>
  );
}

export default Uniforms;
