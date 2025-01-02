import Spinner from '../../ui/Spinner';
import PeopleRow from './PeopleRow';
import { useEffect, useState } from 'react';
import { useData } from '../../services/useUniversal';
import Menus from '../../ui/Menus';
import Table from '../../ui/Table';
import HeaderSortFilter from '../../ui/HeaderSortFilter';
import Empty from '../../ui/Empty';
import { filterChange, sortUpdate } from '../../utils/filterHelpers';
import TableWithFeatures from '../../ui/TableWithFeatures';

const columns = [
  {
    table: 'people',
    label: 'Title',
    key: 'title',
    type: 'string',
    sort: false,
    // sortPriority: 1,
    // defaultSortDirection: true,
    width: '.5fr',
    isSearchable: false,
  },
  {
    table: 'people',
    label: 'First Name',
    key: 'firstName',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    width: '1.5fr',
    isSearchable: true,
  },
  {
    table: 'people',
    label: 'Last Name',
    key: 'lastName',
    type: 'string',
    sort: true,
    sortPriority: 1,
    defaultSortDirection: true,
    width: '1.5fr',
    isSearchable: true,
  },

  {
    table: 'people',
    label: 'Number',
    key: 'cellNumber',
    type: 'number',
    sort: false,
    // sortPriority: 1,
    // defaultSortDirection: true,
    width: '1fr',
    isSearchable: true,
  },
  {
    table: 'people',
    label: 'Email',
    key: 'email',
    type: 'string',
    sort: false,
    // sortPriority: 1,
    // defaultSortDirection: true,
    width: '1.5fr',
    isSearchable: true,
  },
  {
    table: 'people',
    label: 'Created',
    key: 'created_at',
    type: 'date',
    sort: false,
    // sortPriority: 1,
    defaultSortDirection: true,
    width: '1fr',
    isSearchable: true,
  },
  // { width: '0.2fr', key: 'options', columnType: 'string' },
];

function PeopleTable() {
  const columnWidths = columns.reduce((acc, cur) => {
    return (acc = acc.concat(' ', cur.width));
  }, '');
  const [filterOptions, setFilterOptions] = useState({});

  const [currentFilters, setCurrentFilters] = useState([]);
  const [textFilters, setTextFilters] = useState({});
  const [sort, setSort] = useState({
    [[
      ...new Set(
        columns.filter((column) => column.sort).map((column) => column.table)
      ),
    ]]: columns
      .filter((column) => column.sort)
      .map((column) => ({
        field: column.key,
        direction: column.defaultSortDirection,
        sortPriority: column.sortPriority,
      }))
      .sort((a, b) => a.sortPriority - b.sortPriority),
  }); //defaultSort
  const [filteredValues, setFilteredValues] = useState([]);

  const { isLoading, data: people } = useData({
    table: 'people',
    sort: sort.people,
    filter: currentFilters,
  });

  useEffect(() => {
    if (isLoading) return;
    setFilteredValues(people);
  }, [isLoading, people]);

  function handleFilterChange(selected, { name }) {
    const newFilter = filterChange({ selected, name, currentFilters, columns });
    setCurrentFilters(newFilter);
  }
  function handleSearchChange(e) {
    const textField = e.target.name;
    const textValue = e.target.value.toLowerCase();
    const newTextFilter = {
      ...textFilters,
      [textField]: textValue,
    };

    setFilteredValues(
      people.filter((record) =>
        Object.entries(newTextFilter).every(([key, value]) =>
          record[key]?.toLowerCase().includes(value)
        )
      )
    );
    setTextFilters(newTextFilter);
  }

  function handleSort(selectedSort) {
    const newSort = sortUpdate({ selectedSort, sort });
    setSort(newSort);
  }
  if (isLoading || !filteredValues) return <Spinner />;

  return (
    <Menus>
      <TableWithFeatures
        key="people"
        headers={columns}
        data={people}
        rowsPerPage={20}
      />
      {/* <Table columns={columnWidths}>
        <Table.Header>
          {columns.map((column) => (
            <HeaderSortFilter
              key={column.field}
              header={{
                name: column.field,
                label: column.label,
                type: column.type,
                field: column.field,
                table: column.table,
              }}
              sort={{
                sortDirection: sort[column.table]?.find(
                  (each) => each.field === column.field
                )?.direction,
                defaultSortDirection: column.defaultSortDirection,
                handleSort: handleSort,
              }}
              filters={{
                filter: column.filter,
                handleFilterChange: handleFilterChange,
                handleSearchChange,
                options: filterOptions[column.field]?.map((each) => ({
                  label: each,
                  value: each,
                })),
                currentValue: currentFilters
                  .filter((option) => option.field === column.field)
                  .map((option) => [
                    ...option.value.map((field) => ({
                      value: field,
                      label: field,
                    })),
                  ]),
              }}
              isSearchable={column.isSearchable}
            />
          ))}
        </Table.Header>
        {filteredValues?.length === 0 ? (
          <Empty resource="People" />
        ) : (
          <Table.Body
            data={filteredValues}
            render={(person) => <PeopleRow person={person} key={person.id} />}
          />
        )}
      </Table> */}
    </Menus>
  );
}

export default PeopleTable;
