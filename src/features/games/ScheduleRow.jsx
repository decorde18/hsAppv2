import styled from 'styled-components';
import Table from '../../ui/Table';
import { formatTime, formatDate } from '../../utils/helpers';

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
        <Right>
          {game.seasonTime === 'Pre-Season' && (
            <p>
              <strong>S</strong>
            </p>
          )}
        </Right>
        <Right>{formatDate(new Date(game.date))}</Right>
        {game.time ? <Right>{formatTime(game.time, true)}</Right> : <div></div>}
        <div>
          {game.district && (
            <span>
              <strong>*-</strong>
            </span>
          )}
          {game.schools.school}
        </div>
        <div>{game.locations.name}</div>
        <Comment>{game.comment}</Comment>
        <div></div>
      </Table.PrintRow>

      <div></div>
    </>
  );
}

export default ScheduleRow;
