import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useSeasons } from '../seasons/useSeasons';

import { useNavigate } from 'react-router-dom';

import Select from '../../ui/Select';

function SeasonSelector() {
  const { currentSeason, updateCurrentSeason } = useCurrentSeason();

  const { isLoadingSeasons, seasons } = useSeasons();

  const navigate = useNavigate();

  function handleSelectChange({ target }) {
    if (target.value === 'createSeason') {
      navigate(`./newseason`);
      target.value = currentSeason;
    } else updateCurrentSeason(+target.value);
  }
  if (isLoadingSeasons) return;

  const options = [
    { value: 'createSeason', label: 'Add A New Season' },
    ...seasons.map((season) => ({
      value: season.id,
      label: `Season ${season.season} (${season.schoolYear})`,
    })),
  ];

  return (
    <Select
      width={26}
      onChange={handleSelectChange}
      defaultValue={currentSeason}
      options={options}
    />
  );
}
export default SeasonSelector;
