import AddUniformSeasonPlayer from '../features/uniforms/AddUniformSeasonPlayer';
import UniformSeasonPlayerTable from '../features/uniforms/UniformSeasonPlayerTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function UniformSeasonPlayers() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Season Uniform Selector</Heading>
      </Row>
      <Row>
        <UniformSeasonPlayerTable />
        <AddUniformSeasonPlayer />
      </Row>
    </>
  );
}

export default UniformSeasonPlayers;
