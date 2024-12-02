import { useSearchParams } from 'react-router-dom';
import Button from '../../../../ui/Button';

function ModalGamesEditButton() {
  const [searchParams, setSearchParams] = useSearchParams();
  const addParams = () => {
    searchParams.set('edit', true);
    setSearchParams(searchParams);
  };
  return (
    <Button name="manualGame" variation="secondary" onClick={addParams}>
      Edit Stats
    </Button>
  );
}

export default ModalGamesEditButton;
