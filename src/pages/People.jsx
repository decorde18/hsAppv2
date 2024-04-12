import PeopleTable from '../features/people/PeopleTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import AddPeople from '../features/people/AddPeople';
import styled from 'styled-components';

const Sticky = styled.div`
  position: fixed;
`;
const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
function People() {
  return (
    <>
      <StyledDiv>
        <Row type="horizontal">
          <Sticky>
            <Heading as="h1" case="upper">
              All people
            </Heading>
          </Sticky>
        </Row>
        <AddPeople />
      </StyledDiv>
      <Row>
        <PeopleTable />
      </Row>
    </>
  );
}

export default People;
