import AddUniformJersey from '../features/uniforms/AddUniformJersey';
import UniformJerseyTable from '../features/uniforms/UniformJerseyTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function UniformJerseys() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Uniforms</Heading>
      </Row>
      <Row>
        <UniformJerseyTable />
        <AddUniformJersey />
      </Row>
    </>
  );
}

export default UniformJerseys;
