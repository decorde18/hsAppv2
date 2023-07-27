import styled from 'styled-components';

import Table from '../../ui/Table';
import { formatDate } from '../../utils/helpers';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
  width: 100%;
  border: 1px solid;
`;
const Div = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const EmptyDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid;
`;
const Center = styled.div`
  border: 1px solid;
  text-align: center;
  width: 100%;
  border: 1px solid;
`;
function TssaaTableRow({ player }) {
  return (
    <Table.PrintRowBorder>
      <div></div>
      <Player>{`${player.players.people.firstName} ${player.players.people.lastName}`}</Player>
      <Player>{formatDate(new Date(player.players.dateOfBirth))}</Player>
      <Player>{player.players.entryYear}</Player>
      <Player>{player.players.creditsNeeded}</Player>
      <EmptyDiv> </EmptyDiv>
      <Div>
        <Center>{player.returningPlayer ? 'X' : ''}</Center>
        <Center>{!player.returningPlayer ? 'X' : ''}</Center>
      </Div>
      <Div>
        <Center>{player.enrolledLastYear ? 'X' : ''}</Center>
        <Center>{!player.enrolledLastYear ? 'X' : ''}</Center>
      </Div>
      <Div>
        <Center>{player.livesWithParents ? 'X' : ''}</Center>
        <Center>{!player.livesWithParents ? 'X' : ''}</Center>
      </Div>
    </Table.PrintRowBorder>
  );
}

export default TssaaTableRow;
