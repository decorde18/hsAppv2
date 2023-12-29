import Button from '../../ui/Button';
import CreateGameForm from './CreateGameForm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';
import Modal from '../../ui/Modal';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

function AddGame() {
  const session = useSession();
  const { isLoading } = useSessionContext();
  if (isLoading) return <></>;
  return (
    <Modal>
      {!session?.provider_token ? (
        <Modal.Open opens="game-form-error">
          <div>You are not logged in to Google in order to add games</div>
        </Modal.Open>
      ) : (
        <Modal.Open opens="game-form">
          <Button type="selected" variation="primary">
            Add New game
          </Button>
        </Modal.Open>
      )}
      <Modal.Window name="game-form-error">
        <CreateGoogleSignedInError />
      </Modal.Window>
      <Modal.Window name="game-form">
        <CreateGameForm />
      </Modal.Window>
    </Modal>
  );
}
export default AddGame;
