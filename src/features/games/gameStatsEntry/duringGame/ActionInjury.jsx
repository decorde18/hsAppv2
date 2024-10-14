function ActionInjury({ team }) {
  return (
    team && (
      <div>
        <h2>Player Injury for {team}</h2>
        <h2>Restart Game When Ready</h2>
      </div>
    )
  );
}

export default ActionInjury;
