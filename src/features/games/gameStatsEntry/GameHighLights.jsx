import styled from 'styled-components';
import { useGameContext } from '../../../contexts/GameContext';
import { usePlayerContext } from '../../../contexts/PlayerContext';

// Styled component for list items, changes color based on event type

const StyledListItem = styled.li`
  color: ${(props) =>
    props.eventType === 'Goal Scored'
      ? 'green'
      : props.eventType === 'Goal Against'
      ? 'red'
      : 'black'};
  font-weight: ${(props) =>
    props.eventType === 'Goal Scored' || props.eventType === 'Goal Against'
      ? 'bold'
      : 'normal'};
`;

function GameHighLights() {
  const { gameDataArrays } = useGameContext();
  const { periods, stoppages, subs } = gameDataArrays;
  const { players } = usePlayerContext();

  // Combine stoppages and subs with gameMinute and type
  const combinedEvents = [
    ...stoppages.map((stoppage) => ({
      period: stoppage.periodId,
      gameMinute: Math.ceil(stoppage.begin / 60),
      type: stoppage.event,
      details: `${
        stoppage.event === 'Goal Scored' ? 'Goal by ' : 'Goal Against On '
      } ${findPlayerName(stoppage.scorer_or_scoredon)} ${
        stoppage.assister
          ? ', Assist by ' + findPlayerName(stoppage.assister)
          : ''
      } --- ${stoppage.details}`,
    })),
    ...subs.map((sub) => ({
      period: sub.periodId,
      gameMinute: Math.ceil(sub.gameMinute / 60),
      type: 'Substitution',
      details: `${findPlayerName(sub.subIn)} sub in for ${findPlayerName(
        sub.subOut
      )}`,
    })),
  ];

  // Sort combined events by gameMinute
  const sortedEvents = combinedEvents.sort(
    (a, b) => a.gameMinute - b.gameMinute
  );

  // Function to find player full name from players array
  function findPlayerName(playerId) {
    const player = players.find((player) => player.playerid === playerId);
    return player ? player.fullname : '';
  }

  return (
    <>
      {periods
        .sort((a, b) => a.period - b.period)
        .map((period, index) => (
          <div key={index}>
            <h3>Period {period.period}</h3>
            <ul>
              {sortedEvents
                .filter((event) => event.period === period.id)
                .map((event, eventIndex) => (
                  <StyledListItem key={eventIndex} eventType={event.type}>
                    {event.gameMinute}
                    {"'"} {event.type}
                    {event.details && ` - ${event.details}`}
                    {event.subbedIn &&
                      ` (${event.subbedIn} in, ${event.subbedOut} out)`}
                  </StyledListItem>
                ))}
            </ul>
          </div>
        ))}
    </>
  );
}

export default GameHighLights;
