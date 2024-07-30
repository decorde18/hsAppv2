import Button from '../../ui/Button';

import Modal from '../../ui/Modal';
import UniformSeasonCreateForm from './UniformSeasonCreateForm';

function AddUniformSeason() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="uniform-season-form">
          <Button type="selected" variation="primary">
            Add New Uniform Season
          </Button>
        </Modal.Open>
        <Modal.Window name="uniform-season-form">
          <UniformSeasonCreateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUniformSeason;
