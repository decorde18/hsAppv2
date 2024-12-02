import styled from 'styled-components';

import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';

import ActionButtons from './duringGame/ActionButtons';
import Substitutions from './duringGame/Substitutions';

import Button from '../../../ui/Button';
import Heading from '../../../ui/Heading';
import ModalGamesEditButton from './modalGamesEdit/ModalGamesEditButton';
import PlayerTable from './components/PlayerTable';

//todo it was wrapped in this
const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto minmax(auto, 1fr) auto;
  overflow: hidden;
`;
const MainHeader = styled.div`
  flex-shrink: 0;
  height: 15.9rem;
  margin: 1rem 0;
`;
const Main = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal-width columns */
  overflow-y: auto;
`;

const Column = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 1rem;
  border: 1px solid var(--color-grey-50);
  border-radius: 1rem;
`;
const Footer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; /* Scrollable area and fixed buttons */
  overflow: hidden;
`;

function GameDuring() {
  const { periodHandle } = useGameContext();

  const { enterAllSubs } = usePlayerContext();
  return (
    <Container>
      <div>
        <ModalGamesEditButton />
        <Button
          name="endPeriod"
          onClick={periodHandle.endPeriod}
          variation="primary"
        >
          End period
        </Button>
      </div>

      <MainHeader>
        <ActionButtons updateStates={periodHandle.endPeriod} />
      </MainHeader>

      <Main>
        <Column>
          <Heading as="h2" case="upper" location="center">
            PLAYERS ON THE FIELD
          </Heading>
          <PlayerTable
            displayTable={'onField'}
            sortArr={[
              { field: 'number', order: 'asc' },
              { field: 'minPlayed', order: 'dec' },
            ]}
          />
        </Column>
        <Column>
          <Heading as="h2" case="upper" location="center">
            PLAYERS ON THE BENCH
          </Heading>
          <PlayerTable
            displayTable={'offField'}
            sortArr={[
              { field: 'number', order: 'asc' },
              { field: 'minPlayed', order: 'dec' },
            ]}
          />{' '}
        </Column>
      </Main>
      <Footer>
        <Substitutions>
          <Button onClick={enterAllSubs}>Enter all Subs</Button>
        </Substitutions>
      </Footer>
    </Container>
  );
}

export default GameDuring;
