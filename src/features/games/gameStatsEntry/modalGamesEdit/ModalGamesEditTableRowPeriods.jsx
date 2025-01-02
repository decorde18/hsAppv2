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
import GameStatsEditRow from './ModalGamesEditRow';
import { useState } from 'react';
import {
  isValidTimeFormat,
  subtractTime,
  subtractTimes,
} from '../../../../utils/helpers';

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
function ModalGamesEditTableRowPeriods({
  row,
  label,
  handleDelete,
  handleEdit,
  fields,
}) {
  const [inputValue, setInputValue] = useState(row);
  const [lastValidInput, setLastValidInput] = useState(row);

  function handleUpdate(e) {
    const { value, name } = e.target;
    console.log(row);
    // Validate time format if the field is not empty
    if (
      value &&
      (name === 'start' || name === 'end') &&
      !isValidTimeFormat(value)
    ) {
      console.error(`Invalid time format for ${name}: ${value}`);
      e.target.value = lastValidInput[name] || ''; // Reset input field

      return;
    }

    const newInputValue = { ...inputValue, [name]: value };

    const { start, end } = newInputValue;

    // Logic for validation
    if (
      name !== 'start' ||
      name !== 'end' ||
      // Case 1: Both start and end are null
      (!start && !end) ||
      // Case 2: Start has a valid value and end is null
      (start && isValidTimeFormat(start) && !end) ||
      // Case 3: Both are non-null and must satisfy the subtractTime condition
      (start &&
        end &&
        isValidTimeFormat(start) &&
        isValidTimeFormat(end) &&
        subtractTime(start, end) > 0)
    ) {
      // Update the last valid input
      setLastValidInput((prev) => ({ ...prev, newInputValue }));

      // Handle valid input

      handleEdit({
        value: value || null,
        id: row.id,
        key: name,
      });
    } else {
      console.error(
        'Invalid input: Ensure start and end are consistent and properly formatted.'
      );
      e.target.value = lastValidInput[name] || ''; // Reset input field
    }
  }

  function formatField() {
    return Object.entries(row)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => {
        // Find field metadata
        const fieldMeta = fields.find((field) => field.value === key);
        const inputType = fieldMeta?.type;
        const placeholder = getPlaceholder(inputType);
        return GameStatsEditRow({
          field: {
            inputType,
            key,
            name: key,
            value: formatValue(inputValue[key], inputType) || '',
            placeholder,
            size: '100%',
          },
          onChange: (e) =>
            setInputValue((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            })),
          onBlur: handleUpdate,
        });
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

export default ModalGamesEditTableRowPeriods;
