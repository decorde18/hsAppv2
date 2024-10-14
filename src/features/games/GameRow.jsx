import styled from 'styled-components';
import {
  HiPencil,
  HiTrash,
  HiEye,
  HiOutlineChartBar,
  HiVideoCamera,
} from 'react-icons/hi2';
import { MdFreeCancellation } from 'react-icons/md';

import Table from '../../ui/Table';
import Row from '../../ui/Row';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Switch from '../../ui/Switch';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';

import { useDeleteData, useUpdateData } from '../../services/useUniversal';
import { useSession } from '@supabase/auth-helpers-react';

import { statusFilterLabel } from '../../utils/filterHelpers';
import {
  convertSBtimeToLocalTime,
  formatDate,
  formatTime,
} from '../../utils/helpers';

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AddGame from './AddGame';
import CreateGameForm from './CreateGameForm';
import ModalConfirm from '../../ui/ModalConfirm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';

const Game = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-600);
`;

//TODO DEPATURE TIME - SET departure time / bus - pop up
//TODO delete game / change to canceled

function GameRow({ game, teams }) {
  const session = useSession();
  const { isUpdating, updateData } = useUpdateData();
  const { isDeleting, deleteData } = useDeleteData();

  const [toggleStates, setToggleStates] = useState({});

  const isWorking = isUpdating;

  function updateGameStatus(game, update) {
    const { id } = game;
    const { teamType: calendar } = game;
    const { calId } = game; //   id, calendar, calId;
    if (update) {
      updateData({ table: 'games', newData: { status: 'canceled' }, id });
    } else
      deleteData({ table: 'games', id, calendarEvent: { calendar, calId } });
    //todo close modal
    onCloseModal();
    //todo how do we show canceled games in the app
  }
  function handleSelectChange(e) {
    const value = +e.target.value;
    const status = statusFilterLabel.find((val) => val.value === value).label;
    setToggleStates({ ...toggleStates, status: value });
    updateData({ table: 'games', newData: { status }, id: game.id });
  }
  function handleSwitchToggle(e) {
    const name = e.target.name;
    const checked = e.target.checked;
    setToggleStates({ ...toggleStates, [name]: checked });
    updateData({
      table: 'games',
      newData: { [name]: checked },
      id: game.id,
    });
  }
  function handleButtonClick(e) {
    const name = e.target.name;
    const value = e.target.value;
    const updatedArray =
      value === 'false'
        ? [...toggleStates.teamLevel, name] //add to array
        : toggleStates.teamLevel.filter((team) => team !== name); //remove from array
    setToggleStates({ ...toggleStates, teamLevel: updatedArray });
    updateData({
      table: 'games',
      newData: { teamLevel: updatedArray },
      id: game.id,
    });
  }
  return (
    <Table.Row>
      <Game>{game.date && formatDate(new Date(game.date))}</Game>
      <Game>{game.time && formatTime(game.time, true)}</Game>
      <Game>{game.school}</Game>
      <Game>
        {game.teamType === 'Varsity' &&
          game.seasonTime !== 'Pre-Season' &&
          game.status === 'completed' &&
          `${game.result} ${game.gf}-${game.ga}`}
      </Game>
      <Game>{game.locationName}</Game>
      <Game>{game.teamType}</Game>
      <Game>{game.seasonTime}</Game>
      <Game>{game.comment}</Game>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={game.id} />
          <Menus.List id={game.id}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="cancel">
              <Menus.Button icon={<MdFreeCancellation />}>cancel</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
            </Modal.Open>

            <NavLink
              to={`/protected/Game?gameId=${game.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Menus.Button icon={<HiOutlineChartBar />}>Stats</Menus.Button>
            </NavLink>
            {game.veoLink && (
              <NavLink
                to={`https://app.veo.co/matches/${game.veoLink}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Menus.Button icon={<HiVideoCamera />}>Veo Link</Menus.Button>
              </NavLink>
            )}
          </Menus.List>
          <Modal.Window name="edit">
            {<CreateGameForm gameToEdit={game} />}
          </Modal.Window>
          <Modal.Window name="cancel">
            {!session?.provider_token &&
            process.env.NODE_ENV !== 'development' ? (
              <CreateGoogleSignedInError />
            ) : (
              <ModalConfirm
                resourceName="game"
                disabled={isUpdating}
                onConfirm={() => updateGameStatus(game, 'cancel')}
                confirmType="cancel"
              />
            )}
          </Modal.Window>
          <Modal.Window name="delete">
            {!session?.provider_token &&
            process.env.NODE_ENV !== 'development' ? (
              <CreateGoogleSignedInError />
            ) : (
              <ModalConfirm
                resourceName="game"
                disabled={isDeleting}
                onConfirm={() => updateGameStatus(game)}
                confirmType="delete"
              />
            )}
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default GameRow;

// import styled, { css } from 'styled-components';
// import { useState } from 'react';
// import Table from '../../ui/Table';
// import { formatTime, formatDate } from '../../utils/helpers';
// import Modal from '../../ui/Modal';
// import Menus from '../../ui/Menus';
// import {
//   HiPencil,
//   HiTrash,
//   HiMiniXMark,
//   HiOutlineChartBar,
//   HiVideoCamera,
// } from 'react-icons/hi2';
// import { useDeleteGame, useCancelGame } from './useGames';
// import ModalConfirm from '../../ui/ModalConfirm';
// import CreateGameForm from './CreateGameForm';
// import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';

// import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
// import { NavLink } from 'react-router-dom';

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 0 2rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;
// const Opponent = styled.div`
//   font-size: 1.6rem;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   font-family: 'Sono';
// `;
// const results = {
//   W: css`
//     color: green;
//   `,
//   L: css`
//     color: red;
//   `,
// };
// const Result = styled.div`
//   ${(props) => results[props.result]}
// `;
// function GameRow({ game }) {
//   const { isDeleting, deleteGame } = useDeleteGame();
//   const { isCanceling, cancelGame } = useCancelGame();
//   const { isLoading } = useSessionContext(); //needed for Google Calendar

//   const isWorking = isDeleting || isCanceling || isLoading;

//   const session = useSession(); //needed for Google Calendar

//   const ownScore = game.goals.filter(
//     (goal) => goal?.event === 'Goal Scored'
//   ).length;
//   const opponentScore = game.goals.filter(
//     (goal) => goal?.event === 'Goal Against'
//   ).length;
//   const status = game.status === 'to be played' ? null : game.status;
//   const result = // if there is a score post it regardless of game type, otherwise only varsity non-scrimmages should eb posted
//     game.status === 'completed'
//       ? ownScore ||
//         opponentScore ||
//         (game.teamType === 'Varsity' && game.gameType !== 'Scrimmage')
//         ? ownScore > opponentScore
//           ? 'W'
//           : ownScore === opponentScore
//           ? 'T'
//           : 'L'
//         : null
//       : game.status;
//   return (
//     <Table.Row>
//       <div></div>
//       <div>{game.date && formatDate(new Date(game.date))}</div>
//       <div>{game.time && formatTime(game.time, true)}</div>
//       <Opponent>{game.schools.school}</Opponent>
//       {result ? (
//         <Result result={result}>
//           {status === 'completed'
//             ? `${result} ${ownScore}-${opponentScore}`
//             : status}
//         </Result>
//       ) : (
//         <div></div>
//       )}
//       <div>{game.locations.name}</div>
//       <div>{game.teamType}</div>
//       <div>{game.comment}</div>
//       <Modal>
//         <Menus.Menu>
//           <Menus.Toggle id={game.id} />
//           <Menus.List id={game.id}>
//             <Modal.Open opens="edit">
//               <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
//             </Modal.Open>
//             {/* <Modal.Open opens="departureTime"> //TODO probably need to add to edit game or full departure time page with all games to         enter */}
//             <NavLink to={`/protected/Game?gameId=${game.id}`} target="_blank">
//               <Menus.Button icon={<HiOutlineChartBar />}>Stats</Menus.Button>
//             </NavLink>
//             {game.veoLink && (
//               <NavLink
//                 to={`https://app.veo.co/matches/${game.veoLink}/`}
//                 target="_blank"
//               >
//                 <Menus.Button icon={<HiVideoCamera />}>Veo Link</Menus.Button>
//               </NavLink>
//             )}
//             <Modal.Open opens="cancel">
//               <Menus.Button icon={<HiMiniXMark />}>cancel</Menus.Button>
//             </Modal.Open>
//             <Modal.Open opens="delete">
//               <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
//             </Modal.Open>
//           </Menus.List>
//         </Menus.Menu>
//         <Modal.Window name="edit">
//           {<CreateGameForm gameToEdit={game} />}
//         </Modal.Window>
//         {/* <Modal.Window name="departureTime">
//           {<DepartureTimeForm gameToEdit={game} />}
//         </Modal.Window> */}
//         <Modal.Window name="cancel">
//           <ModalConfirm
//             resourceName="games"
//             onConfirm={() => cancelGame(game.id)}
//             disabled={isWorking}
//             confirmType="cancel"
//           />
//         </Modal.Window>
//         <Modal.Window name="delete">
//           {!session?.provider_token ? (
//             <CreateGoogleSignedInError />
//           ) : (
//             <ModalConfirm
//               resourceName="games"
//               onConfirm={() =>
//                 deleteGame({
//                   id: game.id,
//                   calendar: game.teamType,
//                   calId: game.calId,
//                 })
//               }
//               disabled={isWorking}
//               confirmType="delete"
//             />
//           )}
//         </Modal.Window>
//       </Modal>
//     </Table.Row>
//   );
// }

// export default GameRow;
