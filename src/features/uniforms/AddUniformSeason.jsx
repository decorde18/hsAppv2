import Button from '../../ui/Button';
import UniformSeasonCreateForm from './UniformSeasonCreateForm';
import Modal from '../../ui/Modal';

function AddUniformSeason() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="uniform-season-form">
          <Button>Add New Uniform Season</Button>
        </Modal.Open>
        <Modal.Window name="uniform-season-form">
          <UniformSeasonCreateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUniformSeason;
