import Button from '../../ui/Button';
import UniformSeasonPlayerCreateForm from './UniformSeasonPlayerCreateForm';
import Modal from '../../ui/Modal';

function AddUniformSeasonPlayer() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="uniform-season-player-form">
          <Button type="selected" variation="primary">
            Add New Uniform Season
          </Button>
        </Modal.Open>
        <Modal.Window name="uniform-season-player-form">
          <UniformSeasonPlayerCreateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUniformSeasonPlayer;
