import styled from 'styled-components';
import Heading from '../../../ui/Heading';
import { formatDate, formatTime } from '../../../utils/helpers';
import Row from '../../../ui/Row';

const StyledDiv = styled.div`
  padding: 2rem;
  height: 15dvh;
`;
// GAME HEADER - use on (Game Break?, game stoppage? are these modals?),
// before game , after game
function GameHeader({ game, stoppages }) {
  const goalsFor = stoppages.filter(
    (stoppage) => stoppage.event === 'Goal Scored'
  ).length;
  const goalsAgainst = stoppages.filter(
    (stoppage) => stoppage.event === 'Goal Against'
  ).length;

  return (
    <StyledDiv>
      <Row type="horizontal" justify="space-around">
        <Heading as="h4" case="upper" location="center">
          <div>IHS</div>
          <div>{goalsFor}</div>
        </Heading>
        <div>
          <Heading as="h4" case="upper" location="center">
            <div>{game.schools.short_name}</div>
          </Heading>
          <Heading as="h2" case="upper" location="center">
            <div>@{game.locations.name}</div>
            <Row type="horizontal" justify="space-evenly">
              <div />
              <div>{formatDate(new Date(game.date))}</div>
              <div>{formatTime(game?.time, true)}</div>
              <div />
            </Row>
          </Heading>
        </div>
        <Heading as="h4" case="upper" location="center">
          <div>{game.schools.abbreviation}</div>
          <div>{goalsAgainst}</div>
        </Heading>
      </Row>
    </StyledDiv>
  );
}

export default GameHeader;
