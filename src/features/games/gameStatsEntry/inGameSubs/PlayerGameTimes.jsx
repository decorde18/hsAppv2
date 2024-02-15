import Heading from '../../../../ui/Heading';
import styled from 'styled-components';

const StyledTable = styled.div`
  font-family: 'Roboto Mono';
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 2.05rem auto 4.5rem;
  gap: 1rem;
`;
const StyledDiv = styled.div`
  text-align: right;
`;

function PlayerGameTimes({ inGamePlayers, heading }) {
  return (
    <>
      {heading && (
        <Heading as="h5" location="center">
          Reserve Players
        </Heading>
      )}
      {inGamePlayers.map((player) => (
        <StyledTable type="horizontal" justify="flex-start" key={player.id}>
          <StyledDiv>{player.gknumber || player.number}</StyledDiv>
          <div>{player.fullname}</div>
          <StyledDiv>{player.subDetails.time}</StyledDiv>
        </StyledTable>
      ))}
    </>
  );
}

export default PlayerGameTimes;
