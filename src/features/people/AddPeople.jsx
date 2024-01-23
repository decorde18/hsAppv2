import { usePeople } from './usePeople';
import Select from '../../ui/Select';

function CreatePeopleForm({ disabled, name }) {
  const { isLoadingPeople, people } = usePeople();

  function handleSelectChange(e) {}

  return <div></div>;
}

export default CreatePeopleForm;
