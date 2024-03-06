import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useSeasons } from '../seasons/useSeasons';

import PlayerSidebar from './playerIndividualPages/PlayerSidebar';
import PlayerParents from './playerIndividualPages/PlayerParents';
import PlayerPersonalInformation from './playerIndividualPages/PlayerPersonalInformation';
import PlayerSeasons from './playerIndividualPages/PlayerSeasons';

import Heading from '../../ui/Heading';
import Spinner from '../../ui/Spinner';
import styled from 'styled-components';
import { useState } from 'react';
import { useSeasonsPlayer } from './usePlayerSeasons';

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
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeaonsPlayer, seasonsPlayer } = useSeasonsPlayer(
    player.playerId
  );
  const { isLoadingSeasons, seasons } = useSeasons([]);

  const [season, setSeason] = useState();

  function handleSeasonChange(value) {
    setSeason(seasons.find((seas) => seas.id === +value));
  }
  if (isLoadingSeasons || isLoadingSeaonsPlayer) return <Spinner />;
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
            seasonsPlayer={seasonsPlayer}
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

// altRoster: null;
// bio: null;
// captain: null;
// created_at: '2023-11-25T16:09:04.822212+00:00';
// dateOfBirth: '2007-06-16';
// earnedCredits: null;
// enrolledLastYear: true;
// entryYear: 2021;
// firstName: 'Maddie';
// fullname: 'Maddie Clark';
// fullnamelast: 'Clark, Maddie';
// gkRoster: null;
// grade: 12;
// id: 1012;
// lastName: 'Clark';
// livesWithParents: true;
// modified_at: '2023-11-25T16:09:04.822212+00:00';
// picture: null;
// position: null;
// returningPlayer: true;
// rosterNumber: null;
// seasonId: 23;
// starter: null;
// status: 'Interested';
// teamLevel: null;
// updated_at: '2024-02-26T14:18:10.548227+00:00';
