import styled from 'styled-components';
import { HiPencil, HiTrash, HiEye } from 'react-icons/hi2';

import Table from '../../ui/Table';
import Row from '../../ui/Row';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Switch from '../../ui/Switch';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';

import { useUpdateData } from '../../services/useUniversal';

import { statusFilterLabel } from '../../utils/filterHelpers';
import { formatDate } from '../../utils/helpers';

import CreatePlayerForm from './CreatePlayerModalForm';
import { useState } from 'react';
import PlayerIndividualPage from './PlayerIndividualPage';

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-600);
`;

function PlayerSeasonRow({ playerSeason, teams }) {
  const { ...player } = playerSeason;
  const { isUpdating, updateData } = useUpdateData();

  const [toggleStates, setToggleStates] = useState({
    status: statusFilterLabel.find((val) => val.label === player['status'])
      ?.value,
    returningPlayer: player.returningPlayer,
    enrolledLastYear: player.enrolledLastYear,
    livesWithParents: player.livesWithParents,
    teamLevel: player.teamLevel,
  });

  const isWorking = isUpdating;

  function handleSelectChange(e) {
    const value = +e.target.value;
    const status = statusFilterLabel.find((val) => val.value === value).label;
    setToggleStates({ ...toggleStates, status: value });
    updateData({ table: 'playerSeasons', newData: { status }, id: player.id });
  }
  function handleSwitchToggle(e) {
    const name = e.target.name;
    const checked = e.target.checked;
    setToggleStates({ ...toggleStates, [name]: checked });
    updateData({
      table: 'playerSeasons',
      newData: { [name]: checked },
      id: player.id,
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
      table: 'playerSeasons',
      newData: { teamLevel: updatedArray },
      id: player.id,
    });
  }
  //TODO FIXME !!! there is a big error when changing a player from tryout to rostered, in Supabase, I can't seem to set default to empty array.
  return (
    <Table.Row>
      {/* if I want to do this, ...
      {columns.map((column) => {
        switch (column.columnType) {
          case 'string':
            return <Player key={column.field}>{player[column.field]}</Player>;
        }
      })} */}
      <Player>{player.number}</Player>
      <Player>{player.fullname}</Player>
      <Select
        width={12.7}
        options={statusFilterLabel}
        onChange={handleSelectChange}
        name="status"
        disabled={isWorking}
        value={toggleStates['status']}
      />
      <div>
        {player.dateOfBirth && formatDate(new Date(player.dateOfBirth))}
      </div>
      <div>{player.entryYear}</div>
      <div>{player.grade}</div>
      <Switch
        name="returningPlayer"
        checked={toggleStates.returningPlayer || false}
        onChange={handleSwitchToggle}
        disabled={isWorking}
      ></Switch>
      <Switch
        name="enrolledLastYear"
        checked={toggleStates.enrolledLastYear || false}
        onChange={handleSwitchToggle}
        disabled={isWorking}
      ></Switch>
      <Switch
        name="livesWithParents"
        checked={toggleStates.livesWithParents || false}
        onChange={handleSwitchToggle}
        disabled={isWorking}
      ></Switch>
      <Row type="horizontal">
        {toggleStates['status'] === 1 ? (
          teams.map((level) => (
            <div key={level}>
              <Button
                name={level}
                value={toggleStates.teamLevel.includes(level) ? true : false}
                variation={
                  toggleStates.teamLevel.includes(level)
                    ? 'primary'
                    : 'secondary'
                }
                size="xsmall"
                onClick={handleButtonClick}
              >
                {level}
              </Button>
              <input type="hidden" />
            </div>
          ))
        ) : (
          <div></div>
        )}
      </Row>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={player.playerId} />
          <Menus.List id={player.playerId}>
            <Modal.Open opens="view">
              <Menus.Button icon={<HiEye />}>View</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
            </Modal.Open>
            {/* TODO ? THE DELETE MODAL IS TURNED OFF BECAUSE IT DELETES THE PLAYER (not playerseason), DO I WANT THAT? */}
            {/* <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
            </Modal.Open> */}
          </Menus.List>
          <Modal.Window name="view">
            {<PlayerIndividualPage player={playerSeason} />}
          </Modal.Window>

          <Modal.Window name="edit">
            {<CreatePlayerForm playerToEdit={player} />}
          </Modal.Window>

          {/* <Modal.Window name="delete">
            <ModalConfirm
              resourceName="player"
              disabled={isDeleting}
              onConfirm={() => deletePlayer(player.playerId)}
              confirmType="delete"
            />
          </Modal.Window> */}
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default PlayerSeasonRow;
