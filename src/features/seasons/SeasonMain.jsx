import {
  useSeasons,
  useRecentSeason,
  useUpdateSeason,
} from '../../features/seasons/useSeasons';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import SeasonSettings from './SeasonSettings';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';

function SeasonMain() {
  const { currentSeason } = useCurrentSeason();

  const { isLoadingSeasons, seasons } = useSeasons();
  const { isUpdating, updateSeason } = useUpdateSeason();
  const { isLoadingRecent, recentSeason } = useRecentSeason();
  const options = [
    { label: 'pre-Tryout', value: 0 },
    { label: 'tryout', value: 1 },
    { label: 'active', value: 2 },
    { label: 'completed', value: 3 },
  ];
  if (isLoadingSeasons || isLoadingRecent) return <Spinner />;
  function seasonChange(e) {
    const value = e.target.options[e.target.selectedIndex].text;
    const field = 'seasonPhase';
    updateSeason({ [field]: value, id: currentSeason });
  }
  const filteredSeason = seasons.find((season) => season.id === +currentSeason);
  const defaultSeasonPhase = options.find(
    (option) => option.label === filteredSeason.seasonPhase
  ).value;

  return (
    <>
      <div>
        <p>TIME OF SEASON</p>
        <Select
          value={
            options.find(
              (option) => option.label === filteredSeason.seasonPhase
            ).value
          }
          onChange={seasonChange}
          options={options}
        ></Select>
      </div>
      <SeasonSettings />
    </>
  );
}

export default SeasonMain;
