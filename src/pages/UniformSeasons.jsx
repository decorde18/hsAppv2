import AddUniformSeason from '../features/uniforms/AddUniformSeason';
import UniformSeasonTable from '../features/uniforms/UniformSeasonTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function UniformSeasons() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Uniforms</Heading>
      </Row>
      <Row>
        <UniformSeasonTable />
        <AddUniformSeason />
      </Row>
    </>
  );
}

export default UniformSeasons;
