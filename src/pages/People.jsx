import PeopleTable from '../features/people/PeopleTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import AddPeople from '../features/people/AddPeople';
import styled from 'styled-components';

// Scrollable container
const ScrollableContainer = styled.div`
  max-height: 80vh; /* Adjust based on your layout */
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

// Sticky header inside the scrollable container
const StickyHeader = styled.div`
  display: flex;

  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white; /* Ensures it doesn't overlap content visually */
  padding: 0.5rem 0;
`;
function People() {
  return (
    <ScrollableContainer>
      <StickyHeader>
        <Row type="horizontal">
          <Heading as="h1" case="upper">
            All people
          </Heading>
        </Row>
        <AddPeople />
      </StickyHeader>
      <Row>
        <PeopleTable />
      </Row>
    </ScrollableContainer>
  );
}

export default People;
