import { NavLink } from 'react-router-dom';

import Button from '../../../ui/Button';

import { useState } from 'react';

import styled from 'styled-components';
import OnFieldPlayers from './duringGame/OnFieldPlayers';
import OffFieldPlayers from './duringGame/OffFieldPlayers';
import ActionButtons from './duringGame/ActionButtons';
import Substitutions from './duringGame/Substitutions';

import Heading from '../../../ui/Heading';

import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';
import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../../../services/useUniversal';

const Container = styled.div`
  padding: 1rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 95%;
  margin-bottom: 1rem;
`;
const Grid = styled.div`
  flex: 0 0 100%;
  display: grid;
  grid-template-rows: 15.9rem 1fr 1fr;
  align-items: stretch;
`;
const Div = styled.div`
  justify-content: center;
  margin: 1rem;
  display: flex;
  overflow: auto;
`;
const Row = styled.div`
  grid-column: 1 / -1;
`;

function GameDuring({ updateStates, endPeriod }) {
  const { gameDetails, getGameTime, currentPeriod } = useGameContext();
  const { game, subs } = gameDetails;

  const { currentPlayers, enterAllSubs } = usePlayerContext();

  return (
    <>
      <div>
        <NavLink to={`./?gameId=${game.id}&edit=true`}>
          <Button
            name="manualGame"
            // disabled={isEditingGame}
            variation="secondary"
          >
            Edit Stats
          </Button>
        </NavLink>
        <Button name="endPeriod" onClick={endPeriod} variation="primary">
          End period
        </Button>
      </div>

      <Container>
        <Grid>
          <Row>
            <ActionButtons updateStates={updateStates} />
          </Row>
          <Div>
            <div>
              <Heading as="h2" case="upper" location="center">
                PLAYERS ON THE FIELD
              </Heading>
              <OnFieldPlayers players={currentPlayers.onField} />
            </div>
            <div>
              <Heading as="h2" case="upper" location="center">
                PLAYERS ON THE BENCH
              </Heading>
              <OffFieldPlayers players={currentPlayers.offField} />
            </div>
          </Div>
          <Div>
            <Substitutions>
              <Button onClick={enterAllSubs}>Enter all Subs</Button>
            </Substitutions>
          </Div>
        </Grid>
      </Container>
    </>
  );
}

export default GameDuring;
