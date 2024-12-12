import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { useNavigate } from 'react-router-dom';

import Select from '../../ui/Select';

function SeasonSelector() {
  const { currentSeason, updateCurrentSeason, seasons } = useCurrentSeason();

  const navigate = useNavigate();

  function handleSelectChange({ target }) {
    if (target.value === 'createSeason') {
      navigate(`./newseason`);
      target.value = currentSeason.id;
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
      defaultValue={currentSeason.id}
      options={options}
    />
  );
}
export default SeasonSelector;
