import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { useGameContext } from '../../../../contexts/GameContext';
import { usePlayerContext } from '../../../../contexts/PlayerContext';

import Button from '../../../../ui/Button';
import Select from '../../../../ui/Select';
import Table from '../../../../ui/Table';
import ModalGamesEditTableRow from './ModalGamesEditTableRow';

// Styled components
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
  const { periods, game } = gameDataArrays;
  const { subHandle } = usePlayerContext();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  // Editable categories configuration
  const editableCategories = [
    {
      index: 1,
      label: 'Periods',
      single: 'Period',
      value: 'periods',
      categories: [
        {
          width: '.5fr',
          label: 'Period',
          value: 'period',
          type: 'number',
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'Start Time',
          value: 'start',
          type: '24Time',
          allowNull: true,
        },
        {
          width: '1fr',
          label: 'End Time',
          value: 'end',
          type: '24Time',
          allowNull: true,
        },
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
      value: 'stoppages',
      categories: [
        {
          width: '1fr',
          label: 'Start Time',
          value: 'begin',
          type: 'convertedSeconds',
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'End Time',
          value: 'end',
          type: 'convertedSeconds',
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'Team',
          value: 'team',
          allowNull: true,
          type: 'select',
          data: 'team',
          placeholder: 'Select A Team',
        },
        {
          width: '1fr',
          label: 'Clock Stopped',
          value: 'clockStopped',
          type: 'switch',
          allowNull: false,
          defaultValue: false,
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
          label: 'Period',
          value: 'periodId',
          type: 'select',
          data: 'periods',
          allowNull: false,
          placeholder: 'Period',
        },
        {
          width: '.5fr',
          label: 'Minute',
          value: 'gameMinute',
          type: 'convertedSeconds',
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'Sub In',
          value: 'subIn',
          type: 'select',
          data: 'players',
          allowNull: true,
          placeholder: 'Select Sub In Player',
        },
        {
          width: '1fr',
          label: 'Sub Out',
          value: 'subOut',
          type: 'select',
          data: 'players',
          allowNull: true,
          placeholder: 'Select Sub Out Player',
        },
        {
          width: '.5fr',
          label: 'GK',
          value: 'gkSub',
          type: 'checked',
          allowNull: false,
          defaultValue: false,
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
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'End Time',
          value: 'end',
          type: 'convertedSeconds',
          allowNull: false,
        },
        {
          width: '1fr',
          label: 'Team',
          value: 'team',
          type: 'select',
          data: 'team',
          placeholder: 'Select A Team',
        },
        {
          width: '1fr',
          label: 'Clock Stopped',
          value: 'clockStopped',
          type: 'checked',
          allowNull: false,
          defaultValue: false,
        },
        { width: '.5fr', value: 'id' },
      ],
    },
  ];

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

  useMemo(() => {
    if (!currentCategory) return;

    const transformData = (data) => {
      const relevantKeys = currentCategory.categories.map((cat) => cat.value);
      return data.map((item) =>
        relevantKeys.reduce((acc, key) => {
          if (key in item) acc[key] = item[key];
          return acc;
        }, {})
      );
    };

    setFilteredData(() => {
      const categoryValue = currentCategory.value;
      const data = gameDataArrays[categoryValue] || [];

      switch (categoryValue) {
        case 'other':
          return transformData(
            gameDataArrays.stoppages.filter(
              (each) => !each.event.includes('Goal')
            )
          );
        case 'goals':
          return transformData(
            gameDataArrays.stoppages.filter((each) =>
              each.event.includes('Goal')
            )
          );
        case 'discipline':
          return transformData(
            gameDataArrays.stoppages.filter((each) =>
              each.event.includes('Card')
            )
          );
        default:
          return transformData(data);
      }
    });
  }, [currentCategory, gameDataArrays]);

  const columnWidths = useMemo(() => {
    return currentCategory?.categories?.map((col) => col.width).join(' ') || '';
  }, [currentCategory]);

  const handleEdit = ({ value, id, key }) => {
    const handlers = {
      periods: periodHandle.updatePeriod,
      goals: goalHandle.updateGoal,
      subs: subHandle.updateSubManual,
      minorEvents: minorEventHandle.updateMinor,
      stoppages: stoppageHandle.updateStoppage,
      other: stoppageHandle.updateStoppage,
      discipline: disciplineHandle.updateDiscipline,
    };

    handlers[currentCategory?.value]?.({ [key]: value }, id);
  };

  const handleDelete = (id) => {
    const handlers = {
      periods: periodHandle.deletePeriod,
      goals: goalHandle.deleteGoal,
      subs: subHandle.deleteSub,
      minorEvents: minorEventHandle.deleteMinor,
      other: stoppageHandle.deleteStoppage,
      discipline: disciplineHandle.deleteDiscipline,
    };
    handlers[currentCategory?.value]?.(id);
  };
  const handleAddNew = (newData) => {
    const handlers = {
      periods: periodHandle.manualNewPeriod,
      goals: goalHandle.newGoal,
      subs: subHandle.createSubManual,
      minorEvents: minorEventHandle.newMinor,
      other: stoppageHandle.newStoppage,
      discipline: disciplineHandle.newDiscipline,
    };
    if (currentCategory?.value === 'subs')
      newData = { ...newData, game: game.id };
    handlers[currentCategory?.value]?.(newData);
  };
  const addRow = () => {
    const newRow = currentCategory.categories.reduce((acc, cat) => {
      acc[cat.value] = cat.defaultValue ?? '';
      return acc;
    }, {});
    setFilteredData((prev) => [newRow, ...prev]);
  };

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
            value={selectedValue || ''}
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
                <div>
                  <Button onClick={addRow}>Add New Row</Button>
                </div>
                <Table.Body
                  data={filteredData}
                  render={(row) => (
                    <ModalGamesEditTableRow
                      key={row.id}
                      row={row}
                      label={currentCategory?.single}
                      fields={currentCategory?.categories}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleAddNew={handleAddNew}
                      periods={periods}
                      game={game}
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
