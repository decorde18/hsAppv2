import styled from 'styled-components';
import Select from '../../ui/Select';
import { useData, useUpdateData } from '../../services/useUniversal';
import Spinner from '../../ui/Spinner';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Button from '../../ui/Button';
import { supabaseUrl } from '../../services/supabase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PictureSection = styled.div`
  display: grid;
  grid-template-columns: 54rem 1fr;
  gap: 1rem;
  align-items: start;
  justify-content: center;

  @media (max-width: 76.8rem) {
    grid-template-columns: 1fr;
  }
`;
const ImageContainer = styled.div`
  width: 100%;
  max-width: 54rem;
  max-height: 36rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  max-width: 540rem;
  max-height: 36rem;
  object-fit: contain;
`;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const SmallRow = styled.div`
  width: 100%;
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  border: 1px solid var(--color-grey-100);
  border-radius: 5px;
  text-align: center;
`;

const BelowRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  const { isLoading, data } = useData({
    table: 'season_stats_view',
    filter: [{ field: 'seasonid', value: currentSeason.id }],
  });

  const picture = `${supabaseUrl}/storage/v1/object/public/teampics/independence${currentSeason.season}.jpg`;
  const noImage = `${supabaseUrl}/storage/v1/object/public/teampics/unavailableSquare.jpg`;

  function seasonChange(e) {
    const value = e.target.options[e.target.selectedIndex].text;
    const field = 'seasonPhase';
    updateData({
      table: 'seasons',
      newData: [{ [field]: value, id: currentSeason.id }],
      id: currentSeason.id,
    });
  }

  const defaultSeasonPhase = options.find(
    (option) => option.label === currentSeason.seasonPhase
  ).value;
  if (isLoading) return <Spinner />;

  const [seasonStats] = data;

  return (
    <Container>
      <PictureSection>
        <ImageContainer>
          <Image
            src={picture}
            alt={`${currentSeason.season} Team`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = noImage;
            }}
          />
        </ImageContainer>
        <Controls>
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
          <SmallRow>
            <Columns>
              <div>
                <strong>School Year</strong>
                <div>{currentSeason.schoolYear}</div>
              </div>
              <div>
                <strong>Classification</strong>
                <div>{currentSeason.classification}</div>
              </div>
              <div>
                <strong>Region</strong>
                <div>{currentSeason.region}</div>
              </div>
              <div>
                <strong>District</strong>
                <div>{currentSeason.district}</div>
              </div>
            </Columns>
            {seasonStats ? (
              <Columns>
                <Title>
                  <strong>OVERALL</strong>
                  <Columns>
                    <div>
                      <strong>Record</strong>
                      <div>
                        {seasonStats.wins}-{seasonStats.losses}-
                        {seasonStats.ties}
                      </div>
                    </div>
                    <div>
                      <strong>Win %</strong>
                      <div>
                        {(
                          (seasonStats.wins + 0.5 * seasonStats.ties) /
                          (seasonStats.wins +
                            seasonStats.losses +
                            seasonStats.ties)
                        ).toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <strong>Goals</strong>
                      <div>
                        {seasonStats.gf}-{seasonStats.ga}
                      </div>
                    </div>
                  </Columns>
                </Title>
                <Title>
                  <strong>DISTRICT</strong>
                  <Columns>
                    <div>
                      <strong>Record</strong>
                      <div>
                        {seasonStats.distwins}-{seasonStats.distlosses}-
                        {seasonStats.distties}
                      </div>
                    </div>
                    <div>
                      <strong>Win %</strong>
                      <div>
                        {(
                          (seasonStats.distwins + 0.5 * seasonStats.distties) /
                          (seasonStats.distwins +
                            seasonStats.distlosses +
                            seasonStats.distties)
                        ).toFixed(3)}
                      </div>
                    </div>
                  </Columns>
                </Title>
                <Title>
                  <strong>POST-SEASON</strong>
                  <Columns>
                    <div>
                      <strong>Record</strong>
                      <div>
                        {seasonStats.postwins}-{seasonStats.postlosses}
                      </div>
                    </div>
                    <div>
                      <strong>Win</strong>%
                      <div>
                        {(
                          (seasonStats.postwins + 0.5 * seasonStats.postties) /
                          (seasonStats.postwins +
                            seasonStats.postlosses +
                            seasonStats.postties)
                        ).toFixed(3)}
                      </div>
                    </div>
                  </Columns>
                </Title>
              </Columns>
            ) : (
              <Title>NO GAMES PLAYED</Title>
            )}
          </SmallRow>
        </Controls>
      </PictureSection>

      <Staff>
        <Columns>
          <Title>
            <strong>COACHING STAFF</strong>
            <Columns>
              <div>
                <strong>Head Coach</strong>
                <div>{currentSeason.coach}</div>
              </div>
              <div>
                <strong>Assistant Coaches</strong>
                <div>{currentSeason.assistant_coaches}</div>
              </div>
            </Columns>
          </Title>
          <Title>
            <strong>SUPPORT STAFF</strong>
            <Columns>
              <div>
                <strong>Manager</strong>
                <div>{currentSeason.manager}</div>
              </div>
              <div>
                <strong>Trainer</strong>
                <div>{currentSeason.trainer}</div>
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
                <div>{currentSeason.athleticDirector}</div>
              </div>
              <div>
                <strong>Principal</strong>
                <div>{currentSeason.principal}</div>
              </div>
              <div>
                <strong>Assistant Principals</strong>
                <div>{currentSeason.assistantPrincipals}</div>
              </div>
            </Columns>
          </Title>
        </Columns>
      </Staff>
    </Container>
  );
}

export default SeasonOverview;
