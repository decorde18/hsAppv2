import styled from 'styled-components';

import CreatePlayerForm from './CreatePlayerForm';

import { useDeletePlayer } from './useDeletePlayer';

import { HiPencil, HiTrash } from 'react-icons/hi2';

import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { format } from 'date-fns';
import { formatDate } from '../../utils/helpers';

const Player = styled.div`
  font-size: 1.3rem;
  /* font-weight: 400;  */
  /* color: var(--color-grey-600); */
  /* font-family: 'Sono'; */
  width: 100%;
  height: 100%;
`;
const Right = styled.div`
  font-size: 1.3rem;

  width: 100%;
  height: 100%;
  text-align: right;
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

function PublicPlayerRow({ player }) {
  return (
    <Table.PrintRow>
      <div></div>
      <Right>{player.uniform?.uniformJerseys.number}</Right>
      <Player>{`${player.players.people.firstName} ${player.players.people.lastName}`}</Player>

      <Right>{player.grade}</Right>
      <Player>{player.position}</Player>
    </Table.PrintRow>
  );
}

export default PublicPlayerRow;
