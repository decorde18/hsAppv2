import { styled } from 'styled-components';
import { useSeasons, useRecentSeason } from '../features/seasons/useSeasons';
import { useCurrentSeason } from '../contexts/CurrentSeasonContext';
import { useEffect } from 'react';

const Select = styled.select`
  padding-top: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
`;

function SeasonSelector() {
  const { isLoadingSeasons, seasons } = useSeasons();
  const { currentSeason, updateCurrentSeason } = useCurrentSeason();

  const { isLoadingRecent, recentSeason } = useRecentSeason();

  useEffect(
    function () {
      if (!recentSeason) return;
      if (!currentSeason) updateCurrentSeason(recentSeason.id);
    },
    [currentSeason, updateCurrentSeason, recentSeason]
  );

  //   //TODO handle if createNewSeason

  if (isLoadingSeasons || isLoadingRecent) return;

  return (
    <Select
      defaultValue={currentSeason}
      onChange={(e) => updateCurrentSeason(+e.target.value)}
    >
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
