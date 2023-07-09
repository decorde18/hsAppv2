import styled from 'styled-components';
import { useState } from 'react';
import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';
import ButtonIcon from '../../ui/ButtonIcon';
import { useDeletePeople } from './useDeletePeople';
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

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const People = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

function PeopleRow({ person }) {
  const { isDeleting, deletePeople } = useDeletePeople();
  return (
    <>
      <TableRow role="row">
        <div>{person.title}</div>
        <People>{`${person.firstName} ${person.lastName}`}</People>
        <div>{person.nickName}</div>
        <div>{person.otherLastName}</div>
        <div>{person.email}</div>
        <div>{person.cellNumber}</div>
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
