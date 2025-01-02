import Row from '../../../ui/Row';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
import PlayerTable from './components/PlayerTable';
import styled from 'styled-components';
import GameHighLights from './GameHighLights';

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto; /* Left column (1fr) and right area (3fr) */
  grid-template-rows: 6rem auto; /* Header row and content row */
  height: 100vh; /* Full height container */
  overflow: hidden;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LeftColumn = styled.div`
  grid-row: 1 / span 2; /* Spans both header and content rows */
  overflow-y: auto;
  border: 1px solid var(--color-grey-50);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const RightColumn = styled.div`
  grid-row: 2 / 3; /* Starts from the second row */
  display: grid;
  grid-template-rows: 1fr auto; /* Header row and content row */
  overflow: hidden;
`;

const Section = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 1rem;
  border: 1px solid var(--color-grey-50);
  border-radius: 1rem;
`;

function GameAfter() {
  return (
    <Container>
      {/* Header Area */}
      <Row type="horizontal" justify="center">
        <ModalGamesEditButton />
      </Row>

      {/* Left Column */}
      <LeftColumn>
        {/* Content for the left column */}
        <GameHighLights />
      </LeftColumn>

      {/* Right Column */}
      <RightColumn>
        <Section>
          PLAYED
          <PlayerTable
            displayTable={'played'}
            status={'after'}
            sortArr={[
              { field: 'minPlayed', order: 'dec' },
              { field: 'number', order: 'asc' },
            ]}
          />
        </Section>
        <Section>
          DID NOT PLAY
          <PlayerTable
            displayTable={'DNP'}
            status={'after'}
            sortArr={[
              { field: 'number', order: 'asc' },
              { field: 'minPlayed', order: 'dec' },
            ]}
          />
        </Section>
      </RightColumn>
    </Container>
  );
}

export default GameAfter;
