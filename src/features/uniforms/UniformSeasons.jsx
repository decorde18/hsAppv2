import AddUniformSeason from './AddUniformSeason';

import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import UniformSeasonTable from './UniformSeasonTable';

function UniformSeasons() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Season Uniforms</Heading>
      </Row>
      <Row>
        <UniformSeasonTable />
        <AddUniformSeason />
      </Row>
    </>
  );
}

export default UniformSeasons;
