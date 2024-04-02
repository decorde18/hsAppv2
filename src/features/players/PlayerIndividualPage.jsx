import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';

import { useState } from 'react';

import PlayerSidebar from './playerIndividualPages/PlayerSidebar';
import PlayerParents from './playerIndividualPages/PlayerParents';
import PlayerPersonalInformation from './playerIndividualPages/PlayerPersonalInformation';
import PlayerSeasons from './playerIndividualPages/PlayerSeasons';

import Heading from '../../ui/Heading';
import Spinner from '../../ui/Spinner';
import styled from 'styled-components';

const Container = styled.div`
  height: 75vh;
  width: 75vw;
  overflow: hidden;
  display: flex;
  padding: 2rem 2rem 2rem 0;
  gap: 1rem;
`;
const Header = styled.header``;
const Sidebar = styled.aside`
  width: 25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: auto;
`;
const Main = styled.section`
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: auto;
  border-radius: 1rem;
  outline: 2px solid var(--color-grey-100);
`;

function PlayerIndividualPage({ player }) {
  const { currentSeason, seasons } = useCurrentSeason();
  const playerSeasons = useData({
    table: 'playerSeasons',
    filter: [
      { table: 'playerSeasons', field: 'playerId', value: player.playerId },
    ],
  });
  // const seasons = useData({
  //   table: 'seasons',
  // });

  const [season, setSeason] = useState();

  function handleSeasonChange(value) {
    setSeason(seasons.find((seas) => seas.id === +value));
  }
  if (playerSeasons.isLoading) return <Spinner />;
  if (!season) handleSeasonChange(currentSeason);

  return (
    <>
      <Header>
        <Heading as="h1" case="upper" location="center">
          {player.fullname}
        </Heading>
      </Header>
      <Container>
        <Sidebar>
          <PlayerSidebar player={player} season={season} />
        </Sidebar>
        <Main>
          <PlayerPersonalInformation player={player} />
          <PlayerParents player={player} />
          <PlayerSeasons
            seasonsPlayer={playerSeasons.data}
            handleSeasonChange={handleSeasonChange}
            seasons={seasons}
            season={season}
          />
        </Main>
      </Container>
    </>
  );
}

export default PlayerIndividualPage;
