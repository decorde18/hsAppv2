import styled from 'styled-components';

import Table from '../../../../ui/Table';
import Input from '../../../../ui/Input';

import { HiTrash } from 'react-icons/hi2';
import ModalConfirm from '../../../../ui/ModalConfirm';
import Modal from '../../../../ui/Modal';

import Switch from '../../../../ui/Switch';
import { usePlayerContext } from '../../../../contexts/PlayerContext';
import Select from '../../../../ui/Select';
import { useGameContext } from '../../../../contexts/GameContext';
import {
  formatValue,
  getPlaceholder,
} from '../helpers/gameStatsEntryHelperFunctions';

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem 1rem;
  font-size: 2.4rem;
  transition: all 0.2s;
  color: var(--color-red-700);

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;
function ModalGamesEditTableRowSubs({
  row,
  label,
  handleDelete,
  handleEdit,
  fields,
}) {
  const { players } = usePlayerContext();
  const { gameDataArrays } = useGameContext();
  // Utility function to get placeholder based on input type
  console.log(gameDataArrays);
  function formatField() {
    return Object.entries(row)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => {
        // Find field metadata
        const fieldMeta = fields.find((field) => field.value === key);
        const inputType = fieldMeta?.type;
        const placeholder = getPlaceholder(inputType);
        switch (inputType) {
          case 'yesNo':
            return <Switch checked={value} onChange={handleSwitchToggle} />;
          case 'select':
            return (
              <Select
                options={players.map((player) => ({
                  label: player.fullname,
                  value: player.playerid,
                }))}
                onChange={handleSelectChange}
                name="status"
                value={
                  players.find((player) => player.playerid === value)
                    .playerid || ''
                }
                placeholder={'Please Select a Player'}
              />
            );
          default:
            return (
              <Input
                key={key}
                value={formatValue(value, inputType) || ''}
                placeholder={placeholder}
                type={inputType}
                onChange={(e) =>
                  handleEdit({ value: e.target.value, id: row.id, key })
                }
                size="100%"
              />
            );
        }
      });
  }

  function handleSelectChange(e) {}
  function handleSwitchToggle(e) {
    const key = e.target.parentElement.parentElement.id;
    const value = e.target.checked;
    handleEdit({ value, id: key, key });
  }
  return (
    <Table.Row id={row.id}>
      {formatField()}
      <Modal>
        <Modal.Open opens="delete">
          {row.id > 0 && (
            <div id={row.id}>
              <StyledButton>
                <HiTrash />
              </StyledButton>
            </div>
          )}
        </Modal.Open>
        <Modal.Window name="delete">
          <ModalConfirm
            resourceName={label}
            onConfirm={() => handleDelete(row.id)}
            confirmType="delete"
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default ModalGamesEditTableRowSubs;
