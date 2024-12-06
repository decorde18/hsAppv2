import { useState } from 'react';
import styled from 'styled-components';

// Styled components with updated colors and design
const TableContainer = styled.div`
  width: 100%;
  max-height: 53.5rem; /* Set a specific height for vertical scrolling */
  overflow-y: auto; /* Enable scrolling only for the data rows */
  margin: 2rem 0;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 60rem; /* To trigger horizontal scrolling when needed */
`;

const ThTd = styled.th`
  padding: 0.8rem;
  text-align: center;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-brand-500);
  color: var(--color-grey-100);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: ${(props) => `${props.width}rem`};
  &:not(:last-child) {
    border-right: 2px solid var(--color-grey-200); /* Add right border for all th except last */
  }

  &:hover {
    background-color: var(--color-brand-200);
  }
`;

const StyledTd = styled.td`
  padding: 0.8rem;
  width: ${(props) => `${props.width}rem`};
`;
const StyledEndTd = styled.td`
  border-right: 3px solid var(--color-brand-500);
  padding: 0.8rem;
  width: ${(props) => `${props.width}rem`};
`;
const PrimaryHeader = styled.tr`
  position: sticky;
  top: -0.05rem;
  z-index: 2; /* Ensure primary header stays on top of the table */
  color: var(--color-grey-900);
  & > th:last-child {
    border-right: 2px solid var(--color-grey-200); /* Adds a border to the right of the last th */
  }
`;

const SecondaryHeader = styled.tr`
  background-color: var(--color-grey-50);
  position: sticky;
  top: 3.15rem; /* Adjust this based on the height of your primary header */
  z-index: 1;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TableRow = styled.tr`
  text-align: right;
  &:nth-child(even) {
    background-color: var(--color-grey-50);
  }
  &:nth-child(odd) {
    background-color: var(--color-grey-0);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  background-color: var(--color-brand-500);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-100);
  font-weight: 600;

  &:disabled {
    background-color: var(--color-brand-200);
    cursor: not-allowed;
  }

  &:hover {
    background-color: var(--color-brand-100);
    color: var(--color-grey-600);
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  margin-left: 1rem;
  font-size: 0.9em;
  border: 1px solid var(--color-grey-200);
  border-radius: 0.4rem;
  background-color: var(--color-grey-0);
  width: ${(props) => `${props.width * 0.8}rem`};
`;

const StickyFirstColumnTd = styled.td`
  position: sticky;
  left: 0;
  background-color: var(--color-grey-0);
  z-index: 3; /* Ensure it stays above other rows */
  font-weight: 600;
  text-align: left;
  border-right: 3px solid var(--color-brand-500);
  width: ${(props) => `${props.width}rem`};
`;

// Reusable Table Component with Sorting, Filtering, and Pagination
const TableWithFeatures = ({ headers, data, rowsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState(data); // Add state for table data

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let currentData = tableData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setCurrentPage(1);
    setTableData(sortedData); // Update the table data
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredData = currentData.filter((row) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return row[key]
        .toString()
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    });
  });

  const renderPrimaryHeader = () => {
    return headers.map((header, index) => {
      if (header.columns) {
        return (
          <ThTd key={index} colSpan={header.columns.length}>
            {header.label}
          </ThTd>
        );
      } else {
        return (
          <ThTd
            width={header.width || 5}
            key={index}
            rowSpan={2}
            onClick={() => handleSort(header.key)}
          >
            <Column>
              {header.label}
              {sortConfig.key === header.key
                ? sortConfig.direction === 'asc'
                  ? ' ↑'
                  : ' ↓'
                : null}
              <FilterInput
                type="text"
                placeholder={`Filter ${header.label}`}
                onClick={(e) => e.stopPropagation()} // Prevent sort trigger
                onChange={(e) => handleFilterChange(header.key, e.target.value)}
                width={header.width || 5}
              />
            </Column>
          </ThTd>
        );
      }
    });
  };

  const renderSecondaryHeader = () => {
    return headers.map((header, index) => {
      if (header.columns) {
        return header.columns.map((col, colIndex) => (
          <ThTd
            width={col.width || 5}
            key={`${index}-${colIndex}`}
            onClick={() => handleSort(col.key)}
          >
            <Column>
              {col.label}
              {sortConfig.key === col.key
                ? sortConfig.direction === 'asc'
                  ? ' ↑'
                  : ' ↓'
                : null}
              <FilterInput
                type="text"
                placeholder={`Filter ${col.label}`}
                onClick={(e) => e.stopPropagation()} // Prevent sort trigger
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                width={col.width || 5}
              />
            </Column>
          </ThTd>
        ));
      }
    });
  };

  const renderTableRows = () => {
    return filteredData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {headers.map((header, colIndex) => {
          if (header.columns) {
            return header.columns.map((col, colIndex) =>
              colIndex === header.columns.length - 1 ? (
                <StyledEndTd
                  width={col.width || 5}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {styledData(row, col)}
                </StyledEndTd>
              ) : (
                <StyledTd
                  width={col.width || 5}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {styledData(row, col)}
                </StyledTd>
              )
            );
          } else {
            // Conditionally set the background color for the sticky column based on rowIndex
            const stickyBgColor =
              rowIndex % 2 === 0
                ? 'var(--color-grey-0)' // Even rows background color
                : 'var(--color-grey-50)'; // Odd rows background color

            return (
              <StickyFirstColumnTd
                width={header.width || 5}
                key={colIndex}
                style={{ backgroundColor: stickyBgColor }}
              >
                {row[header.key]}
              </StickyFirstColumnTd>
            );
          }
        })}
      </TableRow>
    ));
  };

  const styledData = (row, col) => {
    if (col.type === 'percent') {
      const num = +row[col.key];
      return num.toFixed(3);
    } else return row[col.key];
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <thead>
            <PrimaryHeader>{renderPrimaryHeader()}</PrimaryHeader>
            {headers.some(
              (header) => header.columns && header.columns.length > 0
            ) && <SecondaryHeader>{renderSecondaryHeader()}</SecondaryHeader>}
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </Table>
      </TableContainer>
      <Pagination>
        <PageButton onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </PageButton>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <PageButton
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </Pagination>
    </div>
  );
};

export default TableWithFeatures;
