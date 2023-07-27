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

  const { currentSeason, updateCurrentSeason } = useContext(AppContext);
  //TODO handle if createNewSeason

  useEffect(
    function () {
      if (!recentSeason) return;
      if (currentSeason === '') updateCurrentSeason(recentSeason.id);
    },
    [currentSeason, recentSeason, updateCurrentSeason]
  );
  function handleSeasonChange(e) {
    updateCurrentSeason(e.target.value);
  }

  if (isLoadingSeasons || isLoadingRecent) return;

  return (
    <Select defaultValue={recentSeason.id} onChange={handleSeasonChange}>
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
