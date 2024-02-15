import Heading from '../../../../ui/Heading';
import styled from 'styled-components';

const StyledTable = styled.div`
  font-family: 'Roboto Mono';
  padding: 0 0.4rem;
  display: grid;
  grid-template-columns: 4.8rem auto 4.5rem;
  gap: 0.5rem;
`;
const StyledDiv = styled.div`
  text-align: right;
`;
function CurrentGK({ inGamePlayers }) {
  return (
    <>
      <Heading as="h5" location="center">
        On Field Players
      </Heading>
      {inGamePlayers
        .filter((player) => player.subDetails.gkStatus === 1)
        .map((player) => (
          <StyledTable type="horizontal" justify="flex-start" key={player.id}>
            <StyledDiv>
              <span>GK-</span>
              {player.gknumber || player.number}
            </StyledDiv>
            <div>{player.fullname}</div>
            <StyledDiv>{player.subDetails.gkTime}</StyledDiv>
          </StyledTable>
        ))}
    </>
  );
}

export default CurrentGK;
