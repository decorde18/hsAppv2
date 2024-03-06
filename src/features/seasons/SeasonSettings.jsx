import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import UpdateSeasonForm from './UpdateSeasonForm';
import { useSeason } from './useSeasons';
import Button from '../../ui/Button';
import { NavLink } from 'react-router-dom';
import Spinner from '../../ui/Spinner';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

function SeasonSettings() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeasons, season } = useSeason(currentSeason);

  if (isLoadingSeasons) return <Spinner />;

  return (
    <Row>
      <Button type="selected" variation="primary">
        <NavLink to={`../newseason`}>Add New Season</NavLink>
      </Button>
      <Heading as="h1">{`Update ${season.season} Season`}</Heading>
      <UpdateSeasonForm season={season} />
    </Row>
  );
}

export default SeasonSettings;
