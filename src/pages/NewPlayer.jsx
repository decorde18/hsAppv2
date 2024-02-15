import AppLayoutPublic from '../features/layout/AppLayoutPublic';
import CreatePlayerForm from '../features/players/CreatePlayerForm';

function NewPlayer() {
  return (
    <>
      <AppLayoutPublic logo={true} />
      <CreatePlayerForm />
    </>
  );
}

export default NewPlayer;
