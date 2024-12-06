import Row from '../../../ui/Row';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
import PlayerTable from './components/PlayerTable';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem auto 1fr;
  overflow: hidden;
  margin-bottom: 1rem;
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
      <Row type="horizontal" justify="center">
        <ModalGamesEditButton />
      </Row>
      <Section>
        PLAYED
        <PlayerTable
          displayTable={'played'}
          status={'after'}
          sortArr={[
            { field: 'number', order: 'asc' },
            { field: 'minPlayed', order: 'dec' },
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
    </Container>
  );
}

export default GameAfter;
