import styled from 'styled-components';
import Table from '../../../../ui/Table';
import { HiTrash, HiSave, HiSaveAs } from 'react-icons/hi';
import ModalConfirm from '../../../../ui/ModalConfirm';
import Modal from '../../../../ui/Modal';
import {
  formatValue,
  getPlaceholder,
  validateField,
} from '../helpers/gameStatsEntryHelperFunctions';
import GameStatsEditRow from './ModalGamesEditRow';
import { useEffect, useState, useCallback } from 'react';
import { convertToSeconds, subtractTime } from '../../../../utils/helpers';
import { usePlayerContext } from '../../../../contexts/PlayerContext';
import toast from 'react-hot-toast';

// Styled Components
const ButtonStyled = styled.button`
  width: 100%;
  text-align: center;
  background: none;
  border: none;
  font-size: 2.4rem;
  transition: background-color 0.2s;
  color: ${({ btnColor }) => {
    switch (btnColor) {
      case 'delete':
        return 'var(--color-red-700)';
      case 'enter':
        return 'var(--color-green-700)';
      case 'add':
        return 'var(--color-blue-700)';
      default:
        return 'var(--color-red-700)';
    }
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonLabel = styled.span`
  padding: 1rem;
  font-size: 1rem;
`;

// Main Component
export function ModalGamesEditTableRow({
  row,
  label,
  handleDelete,
  handleEdit,
  handleAddNew,
  fields,
  periods,
  game,
}) {
  const { players } = usePlayerContext();

  // State Management
  const [inputValue, setInputValue] = useState(row);
  const [lastValidInput, setLastValidInput] = useState(row);
  const [fieldMeta, setFieldMeta] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Memoize field metadata to avoid unnecessary recalculations
  useEffect(() => {
    const meta = fields.reduce((acc, field) => {
      const { value, type, allowNull, data, placeholder } = field;
      acc[value] = { type, allowNull, data, placeholder };
      return acc;
    }, {});
    setFieldMeta(meta);
  }, [fields]);

  // Validate input based on field type and null allowance
  const validateInput = useCallback(
    (key, value) => {
      const { type, allowNull } = fieldMeta[key] || {};
      if (!value && !allowNull) return false;
      if (!value) return true;
      return validateField({ value, fieldType: type });
    },
    [fieldMeta]
  );

  // Handle field updates with validation and specific logic for 'Period'
  const handleFieldUpdate = useCallback(
    (key, e) => {
      const { type } = fieldMeta[key] || {};
      let { value } = e.target;
      if (!validateInput(key, value)) {
        toast.error(`Invalid input for ${key}: ${value}`, {
          autoClose: 3000, // 3 seconds
          hideProgressBar: true,
          closeOnClick: true,
        });
        setInputValue((prev) => ({
          ...prev,
          [key]: lastValidInput[key] || '',
        }));
        e.target.focus();
        return;
      }

      if (type === 'convertedSeconds') {
        value = convertToSeconds(value);
      }

      const updatedRow = { ...inputValue, [key]: value };

      if (label === 'Period') {
        const { start, end } = updatedRow;
        value = value === '' ? null : value;
        if (end && start && subtractTime(start, end) < 0) {
          toast.error('Invalid start/end time', {
            autoClose: 3000, // 3 seconds
            hideProgressBar: true,
            closeOnClick: true,
          });
          e.target.focus();
          setInputValue((prev) => ({
            ...prev,
            [key]: lastValidInput[key] || '',
          }));
          return;
        }
      }

      setInputValue(updatedRow);
      setLastValidInput(updatedRow);
      if (row.id) {
        handleEdit({ id: row.id, key, value });
      }
    },
    [
      fieldMeta,
      inputValue,
      handleEdit,
      label,
      lastValidInput,
      row.id,
      validateInput,
    ]
  );

  // Handle Save action
  const handleSave = useCallback(() => {
    const { id, ...newData } = inputValue;
    handleAddNew(newData);
  }, [inputValue, handleAddNew]);

  // Handle Save and Add action
  const handleSaveAndAdd = useCallback(() => {
    //todo this logic doesn't work yet
    const { id, ...newData } = inputValue;
    handleAddNew(newData);
    setInputValue({ ...newData, id: undefined }); // Reset form for new entry
  }, [inputValue, handleAddNew]);

  // Generate select options for select fields
  const handleSelectOptions = (key) => {
    const data = fieldMeta[key]?.data;

    // If data is not provided, return an empty array
    if (!data) return [];

    // Determine options based on the provided data
    if (data === 'players') {
      return players.map((player) => ({
        value: player.playerid,
        label: `${player.number} ${player.fullname}`,
      }));
    }
    if (data === 'periods') {
      return periods.map((period) => ({
        value: period.id,
        label: String(period.period),
      }));
    }
    if (data === 'team') {
      return [
        { value: 'for', label: 'IHS' },
        { value: 'against', label: game.abbreviation },
      ];
    }

    // If data is an array, map it directly to value-label pairs
    if (Array.isArray(data)) {
      return data.map((item) => ({
        value: item.value || item, // Assume the item itself is the value if not specified
        label: item.label || item.toString(), // Use label or stringify the item
      }));
    }

    // For other cases, return an empty array (default behavior)
    return [];
  };

  // Render editable fields
  const renderFields = () => {
    return Object.entries(inputValue)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => {
        const { type: fieldType, data } = fieldMeta[key] || {};
        const placeholder =
          fieldMeta[key]?.placeholder || getPlaceholder(fieldType);

        const handleChange = (e) => {
          const { value, checked } = e.target;
          if (!['switch', 'checked', 'select'].includes(fieldType)) {
            setIsUpdating(true);
          }

          if (['switch', 'checked'].includes(fieldType)) {
            const newValue = checked;
            setInputValue((prev) => ({ ...prev, [key]: newValue }));
            if (row.id) handleEdit({ id: row.id, key, value: newValue });
          } else if (fieldType === 'select') {
            setInputValue((prev) => ({ ...prev, [key]: value }));
            if (row.id) handleEdit({ id: row.id, key, value });
          } else {
            setInputValue((prev) => ({ ...prev, [key]: value }));
          }
        };

        const handleBlur = (e) => {
          setIsUpdating(false);
          handleFieldUpdate(key, e);
        };

        return (
          <GameStatsEditRow
            key={key}
            inputType={fieldType}
            field={{
              key,
              name: key,
              value: isUpdating
                ? inputValue[key]
                : formatValue(inputValue[key], fieldType) || '',
              placeholder,
              size: '100%',
              options: handleSelectOptions(key),
            }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        );
      });
  };

  // Render action buttons within the modal
  const renderModalButtons = () => {
    const isNewRow = !row.id;

    return (
      <IconsWrapper>
        {isNewRow && (
          <>
            <Modal.Open opens="save">
              <ButtonStyled btnColor="enter">
                <HiSave />
                <ButtonLabel>Save</ButtonLabel>
              </ButtonStyled>
            </Modal.Open>
            <Modal.Open opens="addAnother">
              <ButtonStyled btnColor="add">
                <HiSaveAs />
                <ButtonLabel>Save And Add</ButtonLabel>
              </ButtonStyled>
            </Modal.Open>
          </>
        )}
        {!isNewRow && (
          <Modal.Open opens="delete">
            <ButtonStyled btnColor="delete">
              <HiTrash />
              <ButtonLabel>Delete</ButtonLabel>
            </ButtonStyled>
          </Modal.Open>
        )}
      </IconsWrapper>
    );
  };

  return (
    <Table.Row id={row.id}>
      {renderFields()}
      <Modal>
        {renderModalButtons()}
        <Modal.Window name="save">
          <ModalConfirm
            resourceName={label}
            onConfirm={handleSave}
            confirmType="create"
          />
        </Modal.Window>
        <Modal.Window name="addAnother">
          <ModalConfirm
            resourceName={label}
            onConfirm={handleSaveAndAdd}
            confirmType="addAnother"
          />
        </Modal.Window>
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

export default ModalGamesEditTableRow;

// import styled from 'styled-components';
// import Table from '../../../../ui/Table';
// import { HiTrash, HiSave, HiSaveAs } from 'react-icons/hi';
// import ModalConfirm from '../../../../ui/ModalConfirm';
// import Modal from '../../../../ui/Modal';
// import {
//   formatValue,
//   getPlaceholder,
//   validateField,
// } from '../helpers/gameStatsEntryHelperFunctions';
// import GameStatsEditRow from './ModalGamesEditRow';
// import { useEffect, useState } from 'react';
// import { convertToSeconds, subtractTime } from '../../../../utils/helpers';
// import { usePlayerContext } from '../../../../contexts/PlayerContext';

// const StyledButton = styled.button`
//   width: 100%;
//   text-align: center; /* Center-align the text */
//   background: none;
//   border: none;
//   /* padding: 1rem; */
//   font-size: 2.4rem;
//   transition: all 0.2s;
//   color: ${({ color }) => {
//     switch (color) {
//       case 'delete':
//         return 'var(--color-red-700)';
//       case 'enter':
//         return 'var(--color-green-700)';
//       case 'add':
//         return 'var(--color-blue-700)';
//       default:
//         return 'var(--color-red-700)';
//     }
//   }};
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   min-width: 5rem; /* Ensure enough space for longer text */
//   white-space: nowrap; /* Prevent text from wrapping */
//   overflow: hidden; /* Prevent text from overflowing */
//   text-overflow: ellipsis; /* Add ellipsis if text is too long */

//   &:hover {
//     background-color: var(--color-grey-50);
//   }
// `;
// const Icons = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;
// const Span = styled.span`
//   padding: 1rem;
//   font-size: 1rem;
// `;

// export function ModalGamesEditTableRow({
//   row,
//   label,
//   handleDelete,
//   handleEdit,
//   handleAddNew,
//   fields,
// }) {
//   const { players } = usePlayerContext();

//   const [inputValue, setInputValue] = useState(row);
//   const [lastValidInput, setLastValidInput] = useState(row);
//   const [fieldMeta, setFieldMeta] = useState({});
//   const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     const meta = {};
//     fields.forEach(({ value, type, allowNull, data }) => {
//       meta[value] = { type, allowNull, data };
//     });
//     setFieldMeta(meta);
//   }, [fields]);

//   const validateInput = (key, value) => {
//     const { type, allowNull } = fieldMeta[key] || {};
//     if (!value && !allowNull) return false;
//     if (!value) return true;
//     return validateField({ value, fieldType: type });
//   };

//   const handleFieldUpdate = (key, e) => {
//     const { type, allowNull } = fieldMeta[key] || {};
//     let { value } = e.target;
//     if (!validateInput(key, value)) {
//       console.error(`Invalid input for ${key}: ${value}`);
//       setInputValue((prev) => ({ ...prev, [key]: lastValidInput[key] || '' }));
//       e.target.focus();
//       return;
//     }

//     const updatedRow = { ...inputValue, [key]: value };
//     if (type === 'convertedSeconds') value = convertToSeconds(value);
//     if (label === 'Period') {
//       const { start, end } = updatedRow;
//       value = value === '' ? null : value;
//       if (end) {
//         if (start && subtractTime(start, end) < 0) {
//           console.error('Invalid start/end time');
//           e.target.focus();
//           setInputValue((prev) => {
//             return {
//               ...prev,
//               [key]: lastValidInput[key] || '',
//             };
//           });
//           return;
//         }
//       }
//     }

//     setInputValue(updatedRow);
//     setLastValidInput(updatedRow);
//     if (row.id) handleEdit({ id: row.id, key, value });
//   };

//   const handleSave = () => {
//     const { id, ...newData } = inputValue;
//     handleAddNew(newData);
//   };
//   const handleSaveAndAdd = () => {};
//   const handleSelectOptions = (value) => {
//     const handlers = {
//       players: players.map((player) => ({
//         value: player.playerid,
//         label: `${player.number} ${player.fullname}`,
//       })),
//     };
//     return handlers[value];
//   };
//   const renderFields = () =>
//     Object.entries(row)
//       .filter(([key]) => key !== 'id')
//       .map(([key, value]) => {
//         const fieldType = fieldMeta[key]?.type || '';
//         const placeholder = getPlaceholder(fieldType);
//         return (
//           <GameStatsEditRow
//             inputType={fieldType}
//             key={key}
//             field={{
//               key,
//               name: key,
//               value: isUpdating
//                 ? inputValue[key]
//                 : formatValue(inputValue[key], fieldType) || '',
//               placeholder,
//               size: '100%',
//               options:
//                 fieldType === 'select'
//                   ? handleSelectOptions(fieldMeta[key]?.data)
//                   : null,
//             }}
//             onChange={(e) => {
//               //if input field, setIsUpdating to true so any changes do not go through fieldValidation
//               if (
//                 fieldType !== 'switch' ||
//                 fieldType !== 'checked' ||
//                 fieldType !== 'select'
//               )
//                 setIsUpdating(true);
//               const { name, value, checked } = e.target;
//               //if true/false, set checked, not value
//               if (fieldType === 'switch' || fieldType === 'checked') {
//                 setInputValue((prev) => ({
//                   ...prev,
//                   [name]: checked,
//                 }));
//                 handleEdit({ id: row.id, key, value: checked });
//               }
//               if (fieldType === 'select') {
//                 setInputValue((prev) => ({
//                   ...prev,
//                   [name]: value,
//                 }));
//                 handleEdit({ id: row.id, key, value });
//               } else setInputValue((prev) => ({ ...prev, [name]: value }));
//             }}
//             onBlur={(e) => {
//               setIsUpdating(false);
//               handleFieldUpdate(key, e);
//             }}
//           />
//         );
//       });

//   const renderModalButtons = () => (
//     <Icons>
//       {!row.id && (
//         <>
//           <Modal.Open opens="save">
//             <StyledButton color="enter">
//               <HiSave />
//               <Span>Save</Span>
//             </StyledButton>
//           </Modal.Open>
//           <Modal.Open opens="add another">
//             <StyledButton color="add">
//               <HiSaveAs />
//               <Span>Save And Add</Span>
//             </StyledButton>
//           </Modal.Open>
//         </>
//       )}
//       {row.id > 0 && (
//         <Modal.Open opens="delete">
//           <StyledButton color="delete">
//             <HiTrash />
//           </StyledButton>
//         </Modal.Open>
//       )}
//     </Icons>
//   );

//   return (
//     <Table.Row id={row.id}>
//       {renderFields()}
//       <Modal>
//         {renderModalButtons()}
//         <Modal.Window name="save">
//           <ModalConfirm
//             resourceName={label}
//             onConfirm={handleSave}
//             confirmType="create"
//           />
//         </Modal.Window>
//         <Modal.Window name="add another">
//           <ModalConfirm
//             resourceName={label}
//             onConfirm={handleSaveAndAdd}
//             confirmType="add another"
//           />
//         </Modal.Window>
//         <Modal.Window name="delete">
//           <ModalConfirm
//             resourceName={label}
//             onConfirm={() => handleDelete(row.id)}
//             confirmType="delete"
//           />
//         </Modal.Window>
//       </Modal>
//     </Table.Row>
//   );
// }
// export default ModalGamesEditTableRow;
