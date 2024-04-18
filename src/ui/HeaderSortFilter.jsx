import styled from 'styled-components';
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2';
import Select from 'react-select';
import Input from './Input';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

function HeaderSortFilter({ header, sort, filters, isSearchable }) {
  const { name, label, field, table } = header;
  const { handleSort, sortDirection, defaultSortDirection } = sort;
  const {
    handleFilterChange,
    filter,
    options,
    currentValue,
    handleSearchChange,
  } = filters;

  function handleSortChange() {
    if (defaultSortDirection === undefined) return;
    handleSort({
      [table]: [
        {
          field: name,
          direction:
            sortDirection !== undefined ? !sortDirection : defaultSortDirection,
        },
      ],
    });
  }
  return (
    <StyledColumn>
      <StyledRow onClick={handleSortChange}>
        {label}
        {defaultSortDirection !== undefined && //if don't sort
          (sortDirection ? (
            <HiChevronDown />
          ) : sortDirection === null || sortDirection === undefined ? ( //if no default but use it
            <HiChevronUpDown />
          ) : (
            <HiChevronUp />
          ))}
      </StyledRow>
      {filter && (
        <Select
          options={options}
          isMulti={true}
          onChange={handleFilterChange}
          name={field}
          value={currentValue?.length && currentValue[0]}
        />
      )}
      {isSearchable && <Input name={field} onChange={handleSearchChange} />}
    </StyledColumn>
  );
}

export default HeaderSortFilter;
