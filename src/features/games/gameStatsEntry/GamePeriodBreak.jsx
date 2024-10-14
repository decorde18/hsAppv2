import Button from '../../../ui/Button';
import Substitutions from './duringGame/Substitutions';
const popUpOptions = [
  {
    title: 'Confirm Subs Entry',
    message: 'Do you want to enter all subs from waiting subs?',
    confirmType: 'subsConfirmed',
    btnTypes: 'YesNo',
  },
];

//todo create component from GameAfter and use for this to show players and how much they have played
function GamePeriodBreak({ startNextPeriod }) {
  function handleClick() {
    startNextPeriod();
  }

  return (
    <div>
      Game Period Break
      <Substitutions>
        <Button onClick={handleClick}>START Next Period</Button>
      </Substitutions>
    </div>
  );
}

export default GamePeriodBreak;
