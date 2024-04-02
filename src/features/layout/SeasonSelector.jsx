import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';

import { useNavigate } from 'react-router-dom';

import Select from '../../ui/Select';

function SeasonSelector() {
  const { currentSeason, currentSeasonNew, updateCurrentSeason, seasons } =
    useCurrentSeason();

  // const { isLoading, data: seasons } = useData({
  //   table: 'seasons',
  //   sort: [{ field: 'season', direction: false }],
  // });
  const navigate = useNavigate();

  function handleSelectChange({ target }) {
    if (target.value === 'createSeason') {
      navigate(`./newseason`);
      target.value = currentSeasonNew.id;
    } else updateCurrentSeason(+target.value);
  }

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
      defaultValue={currentSeasonNew.id}
      options={options}
    />
  );
}
export default SeasonSelector;
