import styled from 'styled-components';

import Table from '../../ui/Table';

const Player = styled.div`
  font-size: 1.3rem;
  width: 100%;
  height: 100%;
`;
const Right = styled.div`
  font-size: 1.3rem;
  width: 100%;
  height: 100%;
  text-align: right;
`;

function PublicPlayerRow({ player, position }) {
  return (
    <Table.PrintRow>
      <div></div>
      {position === 'GK' ? (
        <Right>{player.gkUniform}</Right>
      ) : !player.secondnumber ? (
        <Right>{player.number}</Right>
      ) : (
        <Right>
          {player.number}/{player.secondnumber}
        </Right>
      )}
      <Player>{`${player.firstName} ${player.lastName}`}</Player>
      <Right>{player.grade}</Right>
      <Player>{player.position}</Player>
    </Table.PrintRow>
  );
}

export default PublicPlayerRow;
