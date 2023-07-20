import styled from 'styled-components';
import { useState } from 'react';
import Table from '../../ui/Table';
import { format } from 'date-fns';
import { formatCurrency, formatTime } from '../../utils/helpers';

const Right = styled.div`
  text-align: right;
`;
const Comment = styled.div`
  font-size: 0.8rem;
`;
function ScheduleRow({ game }) {
  return (
    <>
      <Table.PrintRow>
        <div></div>
        <Right>{format(new Date(game.date), 'MM/dd/yy')}</Right>
        {game.time ? <Right>{formatTime(game.time, true)}</Right> : <div></div>}
        <div>{game.schools.school}</div>
        <div>{game.locations.name}</div>
        <Comment>{game.comment}</Comment>
        <div></div>
      </Table.PrintRow>

      <div></div>
    </>
  );
}

export default ScheduleRow;
