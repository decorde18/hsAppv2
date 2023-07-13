import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
// import PlayerRow from './PlayerRow';
// import PlayerSeasonRow from './PlayerSeasonRow';
import { useGames } from './useGames';

import { useState } from 'react';
import Button from '../../components/Button';
const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.5fr 0.5fr 0.5fr 1fr;
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

function GameTable({ seasonProps }) {
  const { isLoadingGames, games } = useGames();
  console.log(games);
  return <div>games</div>;
}

export default GameTable;
