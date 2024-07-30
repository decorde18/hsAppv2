import Heading from '../../ui/Heading';
import Row from '../../ui/Row';

import AddUniform from './AddUniform';
import UniformTable from './UniformTable';

function UniformsMain() {
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

export default UniformsMain;
