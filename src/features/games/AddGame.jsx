import Button from '../../ui/Button';
import CreateGameForm from './CreateGameForm';
import Modal from '../../ui/Modal';
import styled from 'styled-components';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

function AddGame() {
  const session = useSession();
  const { isLoading } = useSessionContext();
  if (isLoading) return <></>;
  return (
    <>
      <Modal>
        <Modal.Open opens="game-form">
          {!session?.provider_token || !session ? (
            <div>You are not logged in to Google in order to add games</div>
          ) : (
            <Button>Add New Game</Button>
          )}
        </Modal.Open>
        <Modal.Window name="game-form">
          <CreateGameForm
            googleProviderToken={session.provider_token}
          ></CreateGameForm>
        </Modal.Window>
      </Modal>
    </>
  );
}
export default AddGame;
