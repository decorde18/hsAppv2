import Button from '../../ui/Button';
import UniformJerseyCreateForm from './UniformJerseyCreateForm';
import Modal from '../../ui/Modal';

function AddUniformJersey() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="uniform-jersey-form">
          <Button type="selected" variation="primary">
            Add New UniformJersey
          </Button>
        </Modal.Open>
        <Modal.Window name="uniform-jersey-form">
          <UniformJerseyCreateForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUniformJersey;
