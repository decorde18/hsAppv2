import styled from 'styled-components';

import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { useGameContext } from '../../../../contexts/GameContext';

import Button from '../../../../ui/Button';
import Select from '../../../../ui/Select';
import Table from '../../../../ui/Table';

import ModalGamesEditTableRow from './ModalGamesEditTableRow';
import { usePlayerContext } from '../../../../contexts/PlayerContext';

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
    index: 1,
    label: 'Periods',
    single: 'Period',
    value: 'periods',
    categories: [
      { width: '.5fr', label: 'Period', value: 'period', type: 'number' },
      { width: '1fr', label: 'Start Time', value: 'start', type: '24Time' },
      { width: '1fr', label: 'End Time', value: 'end', type: '24Time' },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 2,
    label: 'Minor Events',
    single: 'Minor Event',
    value: 'minorEvents',
    disabled: true,
  },
  {
    index: 3,
    label: 'Goals',
    single: 'Goal',
    value: 'goals',
    categories: [
      {
        width: '1fr',
        label: 'Start Time',
        value: 'begin',
        type: 'convertedSeconds',
      },
      {
        width: '1fr',
        label: 'End Time',
        value: 'end',
        type: 'convertedSeconds',
      },
      { width: '1fr', label: 'Team', value: 'team' },
      {
        width: '1fr',
        label: 'Clock Stopped',
        value: 'clockStopped',
        type: 'yesNo',
      },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 4,
    label: 'Substitutions',
    single: 'Substitution',
    value: 'subs',
    categories: [
      {
        width: '.5fr',
        label: 'Minute',
        value: 'gameMinute',
        type: 'convertedSeconds',
      },
      {
        width: '1fr',
        label: 'Sub In',
        value: 'subIn',
        type: 'select',
        data: 'players',
      },
      {
        width: '1fr',
        label: 'Sub Out',
        value: 'subOut',
        type: 'select',
        data: 'players',
      },
      { width: '.5fr', value: 'id' },
    ],
  },
  {
    index: 5,
    label: 'Discipline',
    single: 'Discipline',
    value: 'discipline',
    categories: [{ width: '.5fr', value: 'id' }],
    disabled: true,
  },
  {
    index: 6,
    label: 'Other Stoppages',
    single: 'Stoppage',
    value: 'other',
    categories: [
      {
        width: '1fr',
        label: 'Start Time',
        value: 'begin',
        type: 'convertedSeconds',
      },
      {
        width: '1fr',
        label: 'End Time',
        value: 'end',
        type: 'convertedSeconds',
      },
      { width: '1fr', label: 'Team', value: 'team' },
      {
        width: '1fr',
        label: 'Clock Stopped',
        value: 'clockStopped',
        type: 'yesNo',
      },
      { width: '.5fr', value: 'id' },
    ],
  },
];

function GameStatsEdit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    gameDataArrays,
    periodHandle,
    minorEventHandle,
    stoppageHandle,
    goalHandle,
    disciplineHandle,
  } = useGameContext();
  const { subHandle } = usePlayerContext();

  const [selectedValue, setSelectedValue] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);

  const removeParams = () => {
    searchParams.delete('edit');
    setSearchParams(searchParams);
  };

  const handleSelectChange = (e) => {
    const category = editableCategories.find(
      (cat) => cat.index === +e.target.value
    );
    setSelectedValue(+e.target.value);
    setCurrentCategory(category);
  };

  const filteredData = useMemo(() => {
    if (!currentCategory) return [];

    const relevantKeys = currentCategory.categories.map((cat) => cat.value);
    const transformData = (data) =>
      data
        .map((item) =>
          relevantKeys.reduce((acc, key) => {
            if (key in item) acc[key] = item[key];
            return acc;
          }, {})
        )
        .sort((a, b) => b.period - a.period)
        .sort((a, b) => b.gameMinute - a.gameMinute)
        .sort((a, b) => b.begin - a.begin);

    switch (currentCategory.value) {
      case 'other':
        return transformData(
          gameDataArrays.stoppages.filter(
            (each) => !each.event.includes('Goal')
          )
        );
      case 'goals':
        return transformData(
          gameDataArrays.stoppages.filter((each) => each.event.includes('Goal'))
        );
      case 'discipline':
        return transformData(
          gameDataArrays.stoppages.filter((each) => each.event.includes('Card'))
        );
      default:
        return transformData(gameDataArrays[currentCategory.value] || []);
    }
  }, [currentCategory, gameDataArrays]);

  const columnWidths = useMemo(() => {
    return currentCategory?.categories?.map((col) => col.width).join(' ') || '';
  }, [currentCategory]);
  function handleAdd() {}
  function handleEdit({ value, id, key }) {
    if (currentCategory.value === 'periods')
      periodHandle.updatePeriod({ [key]: value }, id);
  }
  function handleDelete(id) {
    if (currentCategory.value === 'periods') periodHandle.deletePeriod(id);
    if (currentCategory.value === 'goals') goalHandle.deleteGoal(id);
    if (currentCategory.value === 'subs') subHandle.deleteSub(id);
    if (currentCategory.value === 'minorEvents')
      minorEventHandle.deleteMinor(id);
    if (currentCategory.value === 'other') stoppageHandle.deleteStoppage(id);
    if (currentCategory.value === 'discipline')
      disciplineHandle.deleteDiscipline(id);
  }
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
            placeholder={'Please Select a Category to Update'}
          />
        </TopSection>
        <MainGrid>
          <Column>
            {currentCategory ? (
              <Table columns={columnWidths}>
                <Table.Header>
                  {currentCategory.categories.map((col) => (
                    <div key={col.value}>{col.label}</div>
                  ))}
                </Table.Header>
                <Table.Body
                  data={filteredData}
                  render={(row) => (
                    <ModalGamesEditTableRow
                      key={row.id}
                      row={row}
                      label={currentCategory.single}
                      fields={currentCategory.categories}
                      handleEdit={(values) => handleEdit(values)}
                      handleDelete={(id) => handleDelete(id)}
                    />
                  )}
                />
              </Table>
            ) : (
              <p>No Category Selected</p>
            )}
          </Column>
          <SidePanel>
            <p>
              This shows the players on the field and off the field at the
              current time. Eventually, this will also be editable based on a
              minute-select button.
            </p>
          </SidePanel>
        </MainGrid>
      </Container>
    </Background>
  );
}

export default GameStatsEdit;
