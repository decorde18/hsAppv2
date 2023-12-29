import { useUpdatePlayerSeason } from './usePlayerSeasons';

import { useCreatePlayer } from './useCreatePlayer';
import { useDeletePlayer } from './useDeletePlayer';

import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import ConfirmModal from '../../ui/ConfirmModal';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { format } from 'date-fns';
import CreatePlayerForm from './CreatePlayerModalForm';
import { formatDate } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Switch from '../../ui/Switch';

const values = {
  true: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
  `,
  false: css``,
};
const Div = styled.div`
  display: flex;
`;
const ButtonChecked = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  cursor: pointer;
  ${(props) => values[props.value]}
  &:focus {
    outline: 2px solid var(--color-brand-600);
    outline-offset: -1px;
  }
  &:hover {
    color: var(--color-brand-50);
    background-color: var(--color-brand-700);
  }
`;
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr 0.25fr 0.5fr 0.5fr 0.5fr 1.5fr 0.2fr;
  column-gap: 1.2rem;
  align-items: center;
  padding: 0 2rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  /* font-family: 'Sono'; */
`;

const teamLevels = [
  { value: 1, team: 'Varsity' },
  { value: 2, team: 'JV' },
];

function PlayerSeasonRow({ playerSeason }) {
  const { players: player, teamLevel } = playerSeason;
  const { people } = player;
  const { isDeleting, deletePlayer } = useDeletePlayer();
  const { updateSetting, isUpdating } = useUpdatePlayerSeason();

  const [teamArray, setTeamArray] = useState([]);
  const [livesWithParents, setLivesWithParents] = useState(
    playerSeason.livesWithParents
  );
  const [enrolledLastYear, setEnrolledLastYear] = useState(
    playerSeason.enrolledLastYear
  );
  const [returningPlayer, setReturningPlayer] = useState(
    playerSeason.returningPlayer
  );

  //load TeamLevel
  useEffect(
    function () {
      teamLevels?.map((levels) => {
        teamLevel?.map((level) => {
          if (level.includes(levels.team) && !teamArray.includes(levels.team))
            setTeamArray([...teamArray, levels.team]);
        });
      });
    },
    [teamLevel, teamArray]
  );
  function handleTeamLevelChange(team) {
    let newArr = [];
    !teamArray.includes(team)
      ? (newArr = [...teamArray, team])
      : (newArr = teamArray.filter((t) => t !== team));
    setTeamArray(newArr);
    updateSetting({ teamLevel: newArr, id: playerSeason.id });
  }

  function handleChange(e, field) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value, id: playerSeason.id });
  }
  function handleToggleParents() {
    updateSetting({ livesWithParents: !livesWithParents, id: playerSeason.id });
    setLivesWithParents(!livesWithParents);
  }
  function handleToggleEnrolled() {
    updateSetting({ enrolledLastYear: !enrolledLastYear, id: playerSeason.id });
    setEnrolledLastYear(!enrolledLastYear);
  }
  function handleToggleReturner() {
    updateSetting({ returningPlayer: !returningPlayer, id: playerSeason.id });
    setReturningPlayer(!returningPlayer);
  }

  return (
    <>
      <TableRow>
        <Player>{`${people.firstName} ${people.lastName}`}</Player>
        <select
          defaultValue={playerSeason.status}
          onChange={(e) => handleChange(e, 'status', playerSeason.id)}
          // disabled={isUpdating}
        >
          <option value="Rostered">Rostered</option>
          <option value="Trying Out">Trying Out</option>
          <option value="Interested">Interested</option>
          <option value="Not Playing">Not Playing</option>
        </select>
        <div>
          {player.dateOfBirth && formatDate(new Date(player.dateOfBirth))}
        </div>
        <div>{player.entryYear}</div>
        <div>{playerSeason.grade}</div>
        <div>
          <Switch
            isOn={returningPlayer}
            id2={`returner-${playerSeason.id}`}
            handleToggle={handleToggleReturner}
          ></Switch>
        </div>
        <div>
          <Switch
            isOn={enrolledLastYear}
            id2={`enrolled-${playerSeason.id}`}
            handleToggle={handleToggleEnrolled}
          ></Switch>
        </div>
        <div>
          <Switch
            isOn={livesWithParents}
            id2={`parents-${playerSeason.id}`}
            handleToggle={handleToggleParents}
          ></Switch>
        </div>
        <Div>
          {playerSeason.status === 'Rostered' ? (
            teamLevels.map((levels) => (
              <div key={levels.value}>
                <ButtonChecked
                  value={teamArray.includes(levels.team) ? true : false}
                  // label={levels.team}
                  onClick={() => handleTeamLevelChange(levels.team)}
                >
                  {levels.team}
                </ButtonChecked>
                <input type="hidden" />
              </div>
            ))
          ) : (
            <Div></Div>
          )}
        </Div>

        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={player.id} />
              <Menus.List id={player.id}>
                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit">
                {<CreatePlayerForm playerToEdit={player} />}
              </Modal.Window>

              <Modal.Window name="delete">
                <ConfirmModal
                  resourceName="player"
                  disabled={isDeleting}
                  onConfirm={() => deletePlayer(player.id)}
                  confirmType="delete"
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </TableRow>
    </>
  );
}

export default PlayerSeasonRow;
