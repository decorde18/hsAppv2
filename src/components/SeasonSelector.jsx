import { styled } from 'styled-components';
import { useSeasons, useRecentSeason } from '../features/seasons/useSeasons';
import Spinner from './Spinner';

const Select = styled.select`
  padding-top: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
`;

function SeasonSelector({ seasonProps }) {
  const { currentSeason, recentSeason, onChangeSeason } = seasonProps;
  const { isLoading, seasons } = useSeasons();

  function handleSeasonChange(e) {
    //TODO handle if add new season
    updateCurrentSeason(+e.target.value);
  }
  function updateCurrentSeason(season) {
    onChangeSeason(season);
    localStorage.setItem('currentSeason', season);
  }
  if (isLoading) return <Spinner />;
  return (
    <Select
      defaultValue={currentSeason || recentSeason.id}
      onChange={handleSeasonChange}
    >
      <option value="createSeason">Add A New Season</option>
      {seasons
        .sort((a, b) => +b.season - +a.season)
        .map((season) => (
          <option value={season.id} key={season.id}>
            Season {season.season} ({season.schoolYear})
          </option>
        ))}
    </Select>
  );
}
export default SeasonSelector;
