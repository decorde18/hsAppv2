import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import UpdateSeasonForm from './UpdateSeasonForm';
import { useSeasons } from './useSeasons';
import Button from '../../ui/Button';
import { NavLink, useSearchParams } from 'react-router-dom';
import Spinner from '../../ui/Spinner';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

function SeasonSettings() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeasons, seasons } = useSeasons();

  if (isLoadingSeasons) return <Spinner />;

  const filteredSeason = seasons.find((season) => season.id === +currentSeason);

  return (
    <Row>
      <Button type="selected" variation="primary">
        <NavLink to={`../newseason`}>Add New Season</NavLink>
      </Button>
      <Heading as="h1">{`Update ${filteredSeason.season} Season`}</Heading>
      <UpdateSeasonForm season={filteredSeason} />
    </Row>
  );
}

export default SeasonSettings;
