import { styled } from 'styled-components';
import { useSeasons, useRecentSeason } from '../features/seasons/useSeasons';
import Spinner from './Spinner';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Select = styled.select`
  padding-top: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
`;

function SeasonSelector() {
  const { isLoading, seasons } = useSeasons();
  const { isLoadingRecent, recentSeason } = useRecentSeason([]);
  const [currentSeasonParams, setCurrentSeasonParams] = useSearchParams();
  useEffect(
    function () {
      //!TODO this works but if I click on games or players, etc  it loses the params. I need them to stay
      if (isLoadingRecent) return;
      !currentSeasonParams.get('current-season') &&
        updateCurrentSeason(recentSeason[0].id);
      currentSeasonParams.set('current-season', +recentSeason[0].id);
      setCurrentSeasonParams(currentSeasonParams);
    },
    [recentSeason]
  );
  function handleSeasonChange(e) {
    //TODO handle if add new season
    updateCurrentSeason(+e.target.value);
  }
  function updateCurrentSeason(season) {
    currentSeasonParams.set('current-season', season);
    setCurrentSeasonParams(currentSeasonParams);
  }
  if (isLoading || isLoadingRecent) return <Spinner />;

  return (
    <Select
      defaultValue={+recentSeason?.at(0).id}
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
