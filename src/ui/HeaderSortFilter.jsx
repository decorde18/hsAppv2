import styled from 'styled-components';
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2';
import { useState } from 'react';
import Select from 'react-select';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

function HeaderSortFilter({ header, values, sort, filters }) {
  const { name, type, label, field } = header;
  const { handleSort, defaultSortAsc } = sort;
  const { handleFilterChange, filter, options, defaultValue } = filters;
  const [sortDirection, setSortDirection] = useState(defaultSortAsc);

  function handleSortChange() {
    if (sortDirection === undefined) return;
    const modifier = !sortDirection ? 1 : -1;
    setSortDirection(!sortDirection);
    const sorted =
      type === 'date'
        ? values.sort(
            (a, b) => (new Date(a[name]) - new Date(b[name])) * modifier
          )
        : type === 'string'
        ? values.sort((a, b) => {
            const aa = a[name].toLowerCase();
            const bb = b[name].toLowerCase();
            if (aa < bb) {
              return -1 * modifier;
            }
            if (aa > bb) {
              return 1 * modifier;
            }
            return 0;
          })
        : values.sort((a, b) => (+a[name] - +b[name]) * modifier);

    handleSort(sorted);
  }
  // const selectedOption = {
  //   name: 'status',
  //   option: { value: 'Interested', label: 'Interested' },
  // };
  return (
    <StyledColumn>
      <StyledRow onClick={handleSortChange}>
        {label}
        {sortDirection !== undefined && //if don't sort
          (sortDirection ? (
            <HiChevronDown />
          ) : sortDirection === null ? ( //if no default but use it
            <HiChevronUpDown />
          ) : (
            <HiChevronUp />
          ))}
      </StyledRow>
      {filter && (
        // <Select
        //   options={options}
        //   type="white"
        //   onChange={handleFilterChange}
        //   value={field}
        //   id={field}
        // />
        <Select
          options={options}
          isMulti={true}
          onChange={handleFilterChange}
          name={field}
          value={defaultValue}
        />
      )}
    </StyledColumn>
  );
}

export default HeaderSortFilter;
