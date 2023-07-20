import Button from '../../ui/Button';
import CreatePlayerForm from './CreatePlayerForm';
import Modal from '../../ui/Modal';

function AddPlayer() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="player-form">
          <Button>Add New Player</Button>
        </Modal.Open>
        <Modal.Window name="player-form">
          <CreatePlayerForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
export default AddPlayer;
