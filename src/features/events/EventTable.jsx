import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { useEvents } from './useEvents';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import EventRow from './EventRow';
import AddEvent from './AddEvent';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Menus from '../../ui/Menus';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function EventTable() {
  const { currentSeason } = useCurrentSeason();
  const { isLoadingEvents, events } = useEvents();

  if (isLoadingEvents) return <Spinner />;
  if (!events.length || currentSeason === 'createSeason')
    return (
      <>
        <Empty resource="Events" />
        <AddEvent />
      </>
    );
  return (
    <Menus>
      <StyledDiv>
        <div></div>
        <AddEvent />
      </StyledDiv>
      <Table columns=".1fr 2fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr .1fr">
        <Table.Header>
          <div></div>
          <div>Title</div>
          <div>Team</div>
          <div>Location</div>
          <div>Start Date</div>
          <div>Start Time</div>
          <div>End Date</div>
          <div>End Time</div>
          <div>Comment</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={events}
          render={(event) => <EventRow event={event} key={event.id} />}
        ></Table.Body>
      </Table>
    </Menus>
  );
}

export default EventTable;
