import Button from '../../../ui/Button';

function GamePeriodBreak({ startNextPeriod }) {
  return (
    <div>
      Game Period Break
      <Button onClick={startNextPeriod}>START Next Period</Button>
    </div>
  );
}

export default GamePeriodBreak;
