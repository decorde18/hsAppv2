import Button from '../../ui/Button';
import CreateEventForm from './CreateEventForm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';
import Modal from '../../ui/Modal';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

function AddEvent() {
  const session = useSession();
  const { isLoading } = useSessionContext();
  if (isLoading) return <></>;
  return (
    <Modal>
      {!session?.provider_token ? (
        <Modal.Open opens="event-form-error">
          <div>You are not logged in to Google in order to add events</div>
        </Modal.Open>
      ) : (
        <Modal.Open opens="event-form">
          <Button type="selected" variation="primary">
            Add New Event
          </Button>
        </Modal.Open>
      )}
      <Modal.Window name="event-form-error">
        <CreateGoogleSignedInError />
      </Modal.Window>
      <Modal.Window name="event-form">
        <CreateEventForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddEvent;
