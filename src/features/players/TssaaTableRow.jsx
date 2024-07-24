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
  padding-left: 2rem;
`;
const Div = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-left: 1.5px solid;
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
`;
function TssaaTableRow({ player }) {
  return (
    <Table.PrintRowBorder>
      <Player>{`${player.firstName} ${player.lastName}`}</Player>
      <Player>{formatDate(new Date(player.dateOfBirth))}</Player>
      <Player>{player.entryYear}</Player>
      <Player>{player.creditsNeeded}</Player>
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
