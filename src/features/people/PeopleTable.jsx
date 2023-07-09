import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import PeopleRow from './PeopleRow';
import { usePeople } from './usePeople';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useQuery } from '@tanstack/react-query';

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.5fr 2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  text-align: center;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;
function PeopleTable() {
  const { isLoadingPeople, people } = usePeople();

  if (isLoadingPeople) return <Spinner />;
  return (
    <>
      <Table role="table">
        <TableHeader role="row">
          <div>title</div>
          <div>Person</div>
          <div>nickname</div>
          <div>other Last</div>
          <div>email</div>
          <div>cell</div>
        </TableHeader>
        {people.people.map((person) => (
          <PeopleRow person={person} key={person.id} />
        ))}
      </Table>
    </>
  );
}

export default PeopleTable;
