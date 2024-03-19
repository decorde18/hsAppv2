import styled from 'styled-components';
import { useState } from 'react';
import Select from '../../ui/Select';
import { useData, useUpdateData } from '../../services/useUniversal';
import Spinner from '../../ui/Spinner';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Heading from '../../ui/Heading';
import PlayerSidebar from '../players/playerIndividualPages/PlayerSidebar';
import SeasonSideBar from './SeasonSideBar';
import Button from '../../ui/Button';
import Row from '../../ui/Row';

const Container = styled.div`
  height: 75vh;
  width: 75vw;
  padding: 2rem 2rem 2rem 2rem;
  overflow: hidden;
  /* gap: 1rem; */
`;
const Header = styled.header``;
const Picture = styled.div`
  grid-column: 1/-2;
  grid-row: 1 / 3;
`;
const Main = styled.section`
  margin: auto;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(5, auto);

  padding: 1rem;
  overflow: auto;
  border-radius: 1rem;
  outline: 2px solid var(--color-grey-100);
`;
const Settings = styled.section`
  margin: auto;
  padding: 2rem;
  grid-row: 1 / 3;
`;

const options = [
  { label: 'pre-Tryout', value: 0 },
  { label: 'tryout', value: 1 },
  { label: 'active', value: 2 },
  { label: 'completed', value: 3 },
];
function SeasonOverview() {
  const { currentSeason } = useCurrentSeason();
  const { isUpdating, updateData } = useUpdateData();
  const seasons = useData({
    //UPDATE FOR APPROPRIATE TABLE
    table: 'seasons',
    filter: [{ field: 'id', value: currentSeason }],
  });

  function seasonChange(e) {
    const value = e.target.options[e.target.selectedIndex].text;
    const field = 'seasonPhase';
    updateData({
      table: 'seasons',
      newData: [{ [field]: value, id: currentSeason }],
      id: season.id,
    });
  }
  if (seasons.isLoading) return <Spinner />;

  const season = seasons.data[0];
  const defaultSeasonPhase = options.find(
    (option) => option.label === season.seasonPhase
  ).value;

  return (
    <>
      <Header>
        <Heading as="h1" case="upper" location="center">
          {season.season} season
        </Heading>
      </Header>
      <Container>
        <Main>
          <Picture>
            <SeasonSideBar season={season} />
          </Picture>
          {/* <PlayerPersonalInformation player={player} />
          <PlayerParents player={player} /> */}
          {/* <PlayerSeasons
            seasonsPlayer={playerSeasons.data}
            handleSeasonChange={handleSeasonChange}
            seasons={seasons.data}
            season={season}
          /> */}
          <Settings>
            <Row>
              <Button size="medium" type="fullWidth" variation="primary">
                SETTINGS
              </Button>
              <div />
              <div>
                <p>TIME OF SEASON</p>
                <Select
                  value={defaultSeasonPhase}
                  onChange={seasonChange}
                  options={options}
                  disabled={isUpdating}
                ></Select>
              </div>
            </Row>
          </Settings>
        </Main>
      </Container>

      {/* <SeasonSettings /> */}
    </>
  );
}

export default SeasonOverview;
