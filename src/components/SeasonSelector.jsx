import { styled } from 'styled-components';

const Select = styled.select`
  padding-top: 0.5rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
`;

function SeasonSelector({ seasonProps }) {
  const { currentSeason, onChangeSeason, seasons } = seasonProps;

  function handleSeasonChange(e) {
    if (e.target.value === 'createSeason') return; //TODO handle if createNewSeasonseason
    updateCurrentSeason(e.target.value);
  }

  function updateCurrentSeason(season) {
    onChangeSeason(season);
    localStorage.setItem('currentSeason', season);
  }
  if (!currentSeason) return;
  return (
    <Select defaultValue={currentSeason} onChange={handleSeasonChange}>
      <option value="createSeason">Add A New Season</option>
      {seasons.map((season) => (
        <option value={season.id} key={season.id}>
          Season {season.season} ({season.schoolYear})
        </option>
      ))}
    </Select>
  );
}
export default SeasonSelector;
