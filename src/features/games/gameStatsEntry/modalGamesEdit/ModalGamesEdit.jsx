import styled from 'styled-components';

import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import { useGameContext } from '../../../../contexts/GameContext';

import Button from '../../../../ui/Button';
import Select from '../../../../ui/Select';
import Table from '../../../../ui/Table';

import ModalGamesEditTableRow from './ModalGamesEditTableRow';

const Background = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  position: fixed;
  z-index: 1000;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10.9rem;
  background-color: #f8f9fa;
`;
const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
`;
const TopSection = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal-width columns */
  overflow-y: auto;
`;
const Column = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 1rem;
  border: 1px solid var(--color-grey-50);
  border-radius: 1rem;
`;
const SidePanel = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  background: #ffffff;
`;

const editableCategories = [
  {
    index: 0,
    label: 'Please Select a Category to Update',
    disabled: 'disabled',
  },
  {
    index: 1,
    label: 'Periods',
    value: 'periods',
    categories: [
      { width: '.5fr', label: 'Period', value: 'period' },
      { width: '1fr', label: 'Start Time', value: 'start' },
      { width: '1fr', label: 'End Time', value: 'end' },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 2,
    label: 'Minor Events',
    value: 'minorEvents',
    disabled: 'disabled',
  },
  {
    index: 3,
    label: 'Goals',
    value: 'goals',
    categories: [
      { width: '1fr', label: 'Start Time', value: 'begin' },
      { width: '1fr', label: 'End Time', value: 'end' },
      { width: '1fr', label: 'Team', value: 'team' },
      { width: '1fr', label: 'Clock', value: 'clockStopped' },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 4,
    label: 'Substitutions',
    value: 'subs',
    categories: [
      { width: '.5fr', label: 'Minute', value: 'gameMinute' },
      { width: '1fr', label: 'Sub In', value: 'subIn' },
      { width: '1fr', label: 'Sub Out', value: 'subOut' },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 5,
    label: 'Discipline',
    value: 'discipline',
    categories: [{ width: '.5fr', value: 'id' }],
    disabled: 'disabled',
  },
  {
    index: 6,
    label: 'Other Stoppages',
    value: 'other',
    categories: [
      { width: '1fr', label: 'Start Time', value: 'begin' },
      { width: '1fr', label: 'End Time', value: 'end' },
      { width: '1fr', label: 'Team', value: 'team' },
      { width: '1fr', label: 'Clock', value: 'clockStopped' },
      { width: '.5fr', value: 'id' },
    ],
  },
];

function GameStatsEdit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { gameDataArrays } = useGameContext();

  const [selectedValue, setSelectedValue] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(false);

  function removeParams() {
    searchParams.delete('edit');
    setSearchParams(searchParams);
  }
  function handleSelectChange(e) {
    //todo discipline
    //todo minor events are in this format {for:{foul:[],etc}, against{foul:[],etc}}
    const category = editableCategories.find(
      (cat) => +e.target.value === cat.index
    );
    setSelectedValue(() => +e.target.value);
    setCurrentCategory(category);
  }
  // function handleUpdate() {}
  // function handleDelete() {}
  const data = currentCategory
    ? currentCategory.value === 'other'
      ? gameDataArrays.stoppages.filter((each) => !each.event.includes('Goal'))
      : currentCategory.value === 'goals'
      ? gameDataArrays.stoppages.filter((each) => each.event.includes('Goal'))
      : currentCategory.value === 'discipline'
      ? gameDataArrays.stoppages.filter((each) => each.event.includes('Card'))
      : gameDataArrays[currentCategory.value]
    : [];

  const categories = currentCategory
    ? editableCategories.find((each) => each.value === currentCategory.value)
        .categories
    : {};
  const values = currentCategory ? categories.map((each) => each.value) : [];
  const filteredValues = currentCategory
    ? [
        values
          .filter((key) => key !== 'id')
          .reduce((acc, key) => ({ ...acc, [key]: '' }), { id: 0 }),
        ...data.map((each) =>
          values.reduce((acc, key) => {
            if (each[key]) return { ...acc, [key]: each[key] };
          }, {})
        ),
      ]
    : [];

  return (
    <Background>
      <Header>
        <Button name="manualGame" variation="secondary" onClick={removeParams}>
          Return To Game
        </Button>
      </Header>
      <Container>
        <TopSection>
          <Select
            options={editableCategories.map((cat) => ({
              label: cat.label,
              value: cat.index,
              disabled: cat.disabled,
            }))}
            onChange={handleSelectChange}
            value={selectedValue}
          />
        </TopSection>
        <MainGrid>
          <Column>
            {currentCategory ? (
              <Table columns={categories.map((each) => each.width).join(' ')}>
                <Table.Header>
                  {categories.map((each) => (
                    <div key={each.value}>{each.label}</div>
                  ))}
                </Table.Header>
                <Table.Body
                  data={filteredValues}
                  render={(each) => (
                    <ModalGamesEditTableRow each={each} key={each.id} />
                  )}
                ></Table.Body>
              </Table>
            ) : (
              'No Category Selected'
            )}
          </Column>

          <SidePanel>
            This shows the players on the field and off the field at the current
            time. Eventually, this will also be allowed to changed based on a
            minute select button
          </SidePanel>
        </MainGrid>
      </Container>
    </Background>
  );
}
export default GameStatsEdit;
