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
  grid-column: 1/2;
  grid-row: 1 / 4;
  margin: auto;
`;
const Main = styled.section`
  margin: auto;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(5, auto);

  padding: 1rem;
  overflow: auto;
  border-radius: 1rem;
  outline: 2px solid var(--color-grey-100);
`;
const Title = styled.div`
  margin: 2rem auto;
  text-align: center;
`;
const Columns = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  text-align: center;
`;
const Staff = styled.div`
  padding: 1rem;
  grid-column: 1/3;
  grid-row: 4/5;
  margin: auto;
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
    table: 'seasons',
    filter: [{ field: 'id', value: currentSeason }],
  });
  // const seasonStats = useData({});

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
          {season.teamMascot} {season.season} season
        </Heading>
      </Header>
      <Container>
        <Main>
          <Picture>
            <SeasonSideBar season={season} />
          </Picture>
          <Columns>
            <div>
              <p>
                <strong>TIME OF SEASON</strong>
              </p>
              <Select
                value={defaultSeasonPhase}
                onChange={seasonChange}
                options={options}
                disabled={isUpdating}
              ></Select>
            </div>
            <Button size="medium" type="fullWidth" variation="primary">
              SETTINGS
            </Button>
          </Columns>
          <Columns>
            <div>
              <strong>School Year</strong>
              <div>{season.schoolYear}</div>
            </div>
            <div>
              <strong>Classification</strong>
              <div>{season.classification}</div>
            </div>
            <div>
              <strong>Region</strong>
              <div>{season.region}</div>
            </div>
            <div>
              <strong>District</strong>
              <div>{season.district}</div>
            </div>
          </Columns>
          <Columns>
            <Title>
              <strong>OVERALL</strong>
              <Columns>
                <div>
                  <strong>Record</strong>
                  <div>3-0-0</div>
                </div>
                <div>
                  <strong>Win %</strong>
                  <div>.000</div>
                </div>
                <div>
                  <strong>Goals</strong>
                  <div>36-24</div>
                </div>
              </Columns>
            </Title>
            <Title>
              <strong>DISTRICT</strong>
              <Columns>
                <div>
                  <strong>Record</strong>
                  <div>3-0-0</div>
                </div>
                <div>
                  <strong>Win %</strong>
                  <div>.000</div>
                </div>
              </Columns>
            </Title>
            <Title>
              <strong>POST-SEASON</strong>
              <Columns>
                <div>
                  <strong>Record</strong>
                  <div>3-0-0</div>
                </div>
                <div>
                  <strong>Win</strong>%<div>.000</div>
                </div>
              </Columns>
            </Title>
          </Columns>
          <Staff>
            <Columns>
              <Title>
                <strong>COACHING STAFF</strong>
                <Columns>
                  <div>
                    <strong>Head Coach</strong>
                    <div>{season.coach}</div>
                  </div>
                  <div>
                    <strong>Assistant Coaches</strong>
                    <div>{season.assistant_coaches}</div>
                  </div>
                </Columns>
              </Title>
              <Title>
                <strong>SUPPORT STAFF</strong>
                <Columns>
                  <div>
                    <strong>Manager</strong>
                    <div>{season.manager}</div>
                  </div>
                  <div>
                    <strong>Trainer</strong>
                    <div>{season.trainer}</div>
                  </div>
                </Columns>
              </Title>
            </Columns>
            <Columns>
              <Title>
                <strong>ADMINISTRATION</strong>
                <Columns>
                  <div>
                    <strong>Athletic Director</strong>
                    <div>{season.athleticDirector}</div>
                  </div>
                  <div>
                    <strong>Principal</strong>
                    <div>{season.principal}</div>
                  </div>
                  <div>
                    <strong>Assistant Principals</strong>
                    <div>{season.assistantPrincipals}</div>
                  </div>
                </Columns>
              </Title>
            </Columns>
          </Staff>
        </Main>
      </Container>
    </>
  );
}

export default SeasonOverview;

// coach: null
// : null
// trainer: null
// principal: null
// manager: null

// assistantPrincipals: null
// athleticDirector: null
