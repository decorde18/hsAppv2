import styled from 'styled-components';
import { useState } from 'react';
import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonIcon from '../../ui/ButtonIcon';
import { useDeletePeople } from './useDeletePeople';
import { convertSBdateToLocalDate } from '../../utils/helpers';
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.5fr 2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 0 2rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

function PeopleRow({ person }) {
  const { isDeleting, deletePeople } = useDeletePeople();
  return (
    <>
      <TableRow role="row">
        <div>{person.title}</div>
        <div>{person.firstName}</div>
        <div>{person.lastName}</div>
        <div>{person.cellNumber}</div>
        <div>{person.email}</div>
        <div>{convertSBdateToLocalDate(person.created_at)}</div>
        {/* <div>{person.otherLastName}</div> */}
        {/* <div>{person.email}</div> */}
        {/* <div>{person.cellNumber}</div> */}
        <div>
          {/* <button onClick={() => setShowForm((show) => !show)}>
          <HiPencil />
        </button> */}
          <ButtonIcon
            onClick={() => deletePeople(person.id)}
            disabled={isDeleting}
          >
            <HiTrash />
          </ButtonIcon>
        </div>
      </TableRow>
    </>
  );
}

export default PeopleRow;
