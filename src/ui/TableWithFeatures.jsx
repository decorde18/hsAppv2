import { useState } from 'react';
import styled from 'styled-components';

// Styled components with updated colors and design

const TableContainer = styled.div`
  width: 100%;
  max-height: 53.5rem;
  overflow-x: auto; /* Allow horizontal scrolling */
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
  text-align: right;
`;
const StyledEndTd = styled.td`
  border-right: 3px solid var(--color-brand-500);
  padding: 0.8rem;
  width: ${(props) => `${props.width}rem`};
  text-align: right;
`;
const PrimaryHeader = styled.tr`
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: var(--color-grey-200);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Shadow for layering effect */
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
  height: 4rem; /* Adjust the height as needed */
  text-align: right;
  &:nth-child(even) {
    background-color: var(
      --color-grey-100
    ); /* Slightly darker for better differentiation */
  }
  &:nth-child(odd) {
    background-color: var(--color-grey-50);
  }
  &:hover {
    background-color: var(--color-brand-100); /* Highlight on hover */
    color: var(--color-grey-900); /* Optional: enhance text contrast on hover */
  }
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem; /* Add spacing between elements */
`;
const PageButton = styled.button`
  padding: 0.7rem 1.5rem; /* Increased padding for larger touch targets */
  border-radius: 0.5rem;
  font-size: 1rem; /* Slightly larger font for readability */
  background-color: var(--color-brand-500);
  border: none;
  color: white;

  &:hover {
    background-color: var(--color-brand-400);
  }
  &:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
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
  height: 4rem; /* Adjust the height as needed */
  position: sticky;
  left: 0;
  background-color: var(--color-grey-0);
  z-index: 1; /* Ensure it stays above other rows */
  font-weight: 600;
  text-align: left;
  border-right: 3px solid var(--color-brand-500);
  width: ${(props) => `${props.width}rem`};
  padding-left: 1rem;
`;

const TableWithFeatures = ({
  headers,
  data,
  rowsPerPage,
  defaultSort,
  defaultFilter,
}) => {
  //TODO add a defaultSort and defaultFilter
  //TODO on headers, add a default sortDirection

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState(data); // Add state for table data

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

  // Filtering logic
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page
  };

  const getFilteredData = () => {
    return tableData.filter((row) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return row[key]
          .toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      })
    );
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
              {sortConfig.key === header.key ? (
                <span>{sortConfig.direction === 'asc' ? '🔼' : '🔽'}</span>
              ) : null}
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
              {sortConfig.key === col.key ? (
                <span>{sortConfig.direction === 'asc' ? '🔼' : '🔽'}</span>
              ) : null}
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
    return currentData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {headers.map((header, colIndex) => {
          //is it a column with subcolumns
          //is it the end of the data set
          //is is the first column
          if (colIndex === 0) {
            // Conditionally set the background color for the sticky column based on rowIndex
            const stickyBgColor =
              rowIndex % 2 === 0
                ? 'var(--color-grey-0)' // Even rows background color
                : 'var(--color-grey-50)'; // Odd rows background color

            return (
              <tr key={colIndex}>
                <StickyFirstColumnTd
                  width={header.width || 5}
                  style={{ backgroundColor: stickyBgColor }}
                >
                  {row[header.key]}
                </StickyFirstColumnTd>
              </tr>
            );
          } else if (header.columns) {
            return header.columns.map((subCol, subColIndex) =>
              subColIndex === header.columns.length - 1 ? (
                <StyledEndTd
                  width={subCol.width || 5}
                  key={`${rowIndex}-${subColIndex}`}
                >
                  {styledData(row, subCol)}
                </StyledEndTd>
              ) : (
                <StyledTd
                  width={subCol.width || 5}
                  key={`${rowIndex}-${subColIndex}`}
                >
                  {styledData(row, subCol)}
                </StyledTd>
              )
            );
          } else {
            return (
              <StyledTd
                width={header.width || 5}
                key={`${rowIndex}-${colIndex}`}
              >
                {styledData(row, header)}
              </StyledTd>
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
