import { useContext, useEffect, useState } from 'react';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import UpdateSeasonForm from './UpdateSeasonForm';
import { AppContext } from '../../App';
import { useSeasons } from './useSeasons';

function SeasonSettings() {
  const { currentSeason } = useContext(AppContext);
  const { isLoadingSeasons, seasons } = useSeasons();
  const [season, setSeason] = useState();
  useEffect(
    function () {
      if (isLoadingSeasons || currentSeason === '') return;
      setSeason(seasons.find((season) => +season.id === currentSeason));
    },
    [currentSeason, seasons, isLoadingSeasons]
  );
  if (isLoadingSeasons || !season) return;
  return (
    <Row>
      <Heading as="h1">{`Update ${season.season} Season`}</Heading>
      <UpdateSeasonForm season={season} />
    </Row>
  );
}

export default SeasonSettings;
