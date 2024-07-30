// import AddUniformJersey from './AddUniformJersey';

import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import UniformJerseyTable from './UniformJerseyTable';

function UniformJerseys() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Season Jerseys</Heading>
      </Row>
      <Row>
        <UniformJerseyTable />
        {/* <AddUniformJersey /> */}
      </Row>
    </>
  );
}

export default UniformJerseys;
