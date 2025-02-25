import Table from '../../ui/Table';
import { formatTime, formatDate } from '../../utils/helpers';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import { useDeleteEvent } from './useEvents';
import ModalConfirm from '../../ui/ModalConfirm';
import CreateEventForm from './CreateEventForm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

function EventRow({ event }) {
  const { isDeleting, deleteEvent } = useDeleteEvent();
  const { isLoading } = useSessionContext();

  const isWorking = isDeleting || isLoading;

  const session = useSession();
  return (
    <Table.Row>
      <div></div>
      <div>{event.summary}</div>
      <div>{event.calendarType}</div>
      <div>{event.location}</div>
      <div>
        {event.startDateTime && formatDate(new Date(event.startDateTime))}
      </div>
      <div>
        {!event.allDay &&
          event.startDateTime &&
          formatTime(new Date(event.startDateTime).toLocaleTimeString(), true)}
      </div>
      <div>{event.endDateTime && formatDate(new Date(event.endDateTime))}</div>
      <div>
        {!event.allDay &&
          event.endDateTime &&
          formatTime(new Date(event.endDateTime).toLocaleTimeString(), true)}
      </div>
      <div>{event.description}</div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={event.id} />
          <Menus.List id={event.id}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name="edit">
          {<CreateEventForm eventToEdit={event} />}
        </Modal.Window>
        <Modal.Window name="delete">
          {!session?.provider_token ? (
            <CreateGoogleSignedInError />
          ) : (
            <ModalConfirm
              resourceName="event"
              onConfirm={() =>
                deleteEvent({
                  id: event.id,
                  calendar: event.calendarType,
                  calId: event.calId,
                })
              }
              disabled={isWorking}
              confirmType="delete"
            />
          )}
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default EventRow;
