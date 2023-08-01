import AddUniform from '../features/uniforms/AddUniform';
import UniformTable from '../features/uniforms/UniformTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Uniforms() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Uniforms</Heading>
      </Row>
      <Row>
        <UniformTable />
        <AddUniform />
      </Row>
    </>
  );
}

export default Uniforms;
