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
function GameHeader({ game }) {
  return (
    <StyledDiv>
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
    </StyledDiv>
  );
}

export default GameHeader;
