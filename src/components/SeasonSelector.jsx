import { styled } from 'styled-components';
import { useSeasons, useRecentSeason } from '../features/seasons/useSeasons';
import { useCurrentSeason } from '../contexts/CurrentSeasonContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Select = styled.select`
  padding: 0.5rem 2rem;
  font-size: 1.75rem;
  line-height: 2.25rem;
  text-align: center;
`;

function SeasonSelector() {
  const { isLoadingSeasons, seasons } = useSeasons();
  const { currentSeason, updateCurrentSeason, updateRecentSeason } =
    useCurrentSeason();
  const { isLoadingRecent, recentSeason } = useRecentSeason();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isLoadingRecent || !recentSeason) return;
      updateRecentSeason(recentSeason.id);
      if (!currentSeason) updateCurrentSeason(recentSeason.id);
    },
    [
      currentSeason,
      updateCurrentSeason,
      recentSeason,
      updateRecentSeason,
      isLoadingRecent,
    ]
  );

  if (isLoadingSeasons || isLoadingRecent) return;
  function seasonChange(e) {
    if (e.target.value === 'createSeason') {
      navigate('./newseason');
      e.target.value = currentSeason;
    } else updateCurrentSeason(+e.target.value);
  }

  return (
    <Select defaultValue={currentSeason} onChange={seasonChange}>
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
