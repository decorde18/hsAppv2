import Button from '../../ui/Button';
import UniformCreateForm from './UniformCreateForm';
import Modal from '../../ui/Modal';

function AddUniform() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="uniform-form">
          <Button>Add New Uniform</Button>
        </Modal.Open>
        <Modal.Window name="uniform-form">
          <UniformCreateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUniform;
