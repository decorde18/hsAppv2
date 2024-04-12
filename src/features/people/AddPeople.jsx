import Button from '../../ui/Button';
import CreatePeopleForm from './CreatePeopleForm';
import Modal from '../../ui/Modal';

function AddPeople() {
  return (
    <Modal>
      <Modal.Open opens="person-form">
        <Button type="selected" variation="primary">
          Add New Person
        </Button>
      </Modal.Open>
      <Modal.Window name="person-form">
        <CreatePeopleForm />
      </Modal.Window>
    </Modal>
  );
}
export default AddPeople;
