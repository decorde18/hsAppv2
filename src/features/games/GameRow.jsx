import styled from 'styled-components';
import {
  HiPencil,
  HiTrash,
  HiOutlineChartBar,
  HiVideoCamera,
} from 'react-icons/hi2';
import { MdFreeCancellation } from 'react-icons/md';

import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';

import { useDeleteData, useUpdateData } from '../../services/useUniversal';
import { useSession } from '@supabase/auth-helpers-react';

import { formatDate, formatTime } from '../../utils/helpers';

import { NavLink } from 'react-router-dom';
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

function GameRow({ game }) {
  const session = useSession();
  const { isUpdating, updateData } = useUpdateData();
  const { isDeleting, deleteData } = useDeleteData();

  function updateGameStatus(game, update) {
    const { id } = game;
    const { teamType: calendar } = game;
    const { calId } = game; //   id, calendar, calId;
    if (update) {
      updateData({ table: 'games', newData: { status: 'canceled' }, id });
    } else
      deleteData({ table: 'games', id, calendarEvent: { calendar, calId } });

    //todo how do we show canceled games in the app
    //TODO delete game doesn't updte UI - i bet the view needs to be mutated on delete, currently the table games is mutated
  }
  // function handleSelectChange(e) {
  //   const value = +e.target.value;
  //   const status = statusFilterLabel.find((val) => val.value === value).label;
  //   setToggleStates({ ...toggleStates, status: value });
  //   updateData({ table: 'games', newData: { status }, id: game.id });
  // }
  // function handleSwitchToggle(e) {
  //   const name = e.target.name;
  //   const checked = e.target.checked;
  //   setToggleStates({ ...toggleStates, [name]: checked });
  //   updateData({
  //     table: 'games',
  //     newData: { [name]: checked },
  //     id: game.id,
  //   });
  // }
  // function handleButtonClick(e) {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   const updatedArray =
  //     value === 'false'
  //       ? [...toggleStates.teamLevel, name] //add to array
  //       : toggleStates.teamLevel.filter((team) => team !== name); //remove from array
  //   setToggleStates({ ...toggleStates, teamLevel: updatedArray });
  //   updateData({
  //     table: 'games',
  //     newData: { teamLevel: updatedArray },
  //     id: game.id,
  //   });
  // }
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
