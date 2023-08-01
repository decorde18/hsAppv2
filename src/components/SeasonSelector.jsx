import { styled } from 'styled-components';
import {
  useSeason,
  useSeasons,
  useRecentSeason,
} from '../features/seasons/useSeasons';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import Spinner from '../ui/Spinner';

const Select = styled.select`
  padding-top: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
`;

function SeasonSelector() {
  const { isLoadingSeasons, seasons } = useSeasons();
  const { isLoadingRecent, recentSeason } = useRecentSeason();
  const curSeason = localStorage.getItem('currentSeason');
  const { currentSeason, setCurrentSeason } = useContext(AppContext);
  //TODO handle if createNewSeason

  useEffect(
    function () {
      if (curSeason) setCurrentSeason(curSeason);
      if (!recentSeason) return;
      if (currentSeason === '') setCurrentSeason(recentSeason.id);
    },
    [currentSeason, recentSeason, setCurrentSeason, curSeason]
  );
  function handleSeasonChange(e) {
    localStorage.setItem('currentSeason', e.target.value);

    setCurrentSeason(e.target.value);
  }
  if (isLoadingSeasons || isLoadingRecent) return;

  return (
    <Select defaultValue={currentSeason} onChange={handleSeasonChange}>
      <option value="createSeason">Add A New Season</option>
      {seasons.map((season) => (
        <option value={season?.id || 'createSeason'} key={season.id}>
          Season {season.season} ({season.schoolYear})
        </option>
      ))}
    </Select>
  );
}
export default SeasonSelector;
