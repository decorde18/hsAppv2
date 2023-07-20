import Button from '../../ui/Button';
import CreateGameForm from './CreateGameForm';
import Modal from '../../ui/Modal';

function AddGame() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="game-form">
          <Button>Add New Game</Button>
        </Modal.Open>
        <Modal.Window name="game-form">
          <CreateGameForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
export default AddGame;
