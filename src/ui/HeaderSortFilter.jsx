import styled from 'styled-components';
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from 'react-icons/hi2';
import { useState } from 'react';

const StyledColumn = styled.div`
  display: flex;
  justify-content: space-between;
`;

function HeaderSortFilter({
  name,
  type,
  label,
  values,
  handleSort,
  defaultSortAsc,
}) {
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
  return (
    <StyledColumn onClick={handleSortChange}>
      <div>{label}</div>
      {sortDirection !== undefined && //if don't sort
        (sortDirection ? (
          <HiChevronDown />
        ) : sortDirection === null ? ( //if no default but use it
          <HiChevronUpDown />
        ) : (
          <HiChevronUp />
        ))}
    </StyledColumn>
  );
}

export default HeaderSortFilter;
