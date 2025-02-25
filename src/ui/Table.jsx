import { createContext, useContext } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  max-height: 53.5rem;
  overflow-x: auto; /* Allow horizontal scrolling */
  margin: 2rem 0;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
`;
// const Table = styled.table``;

const StyledTable = styled.div`
  width: 100%;
  border-collapse: collapse;
  min-width: 60rem; /* To trigger horizontal scrolling when needed */
  /* border: 1px solid var(--color-grey-200); */
  padding: 1rem;
  font-size: 1.25rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
`;
const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2rem;
  align-items: center;
  transition: none;
`;
const StyledHeader = styled(CommonRow)`
  background-color: var(--color-grey-50);
  /* background-color: red; */
  padding: 1rem;
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  border-radius: 1rem 1rem 0 0;
  font-size: 0.9rem;
  font-weight: 600;
  position: sticky;

  z-index: 5;
`;
const StyledPrintHeader = styled(CommonRow)`
  padding: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
`;
const StyledPrintHeaderBorder = styled(CommonRow)`
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  border: 1px solid;
  column-gap: 0;
`;
const StyledRow = styled(CommonRow)`
  padding: 0.2rem 1rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;
const StyledPrintRow = styled(CommonRow)`
  padding: 0.1rem;
  font-size: 1.1rem;
  /* &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  } */
`;
const StyledPrintRowBorder = styled(CommonRow)`
  font-size: 1.1rem;
  column-gap: 0;
  /* &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  } */
`;
const StyledBody = styled.section`
  margin: 0.4rem 0;
`;
const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;
const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns} as="header">
      {children}
    </StyledHeader>
  );
}
function PrintHeader({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledPrintHeader role="row" columns={columns} as="print-header">
      {children}
    </StyledPrintHeader>
  );
}
function PrintHeaderBorder({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledPrintHeaderBorder
      role="row"
      columns={columns}
      as="print-header-border"
    >
      {children}
    </StyledPrintHeaderBorder>
  );
}
function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}
function PrintRow({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledPrintRow role="print-row" columns={columns}>
      {children}
    </StyledPrintRow>
  );
}
function PrintRowBorder({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledPrintRowBorder role="print-row-border" columns={columns}>
      {children}
    </StyledPrintRowBorder>
  );
}

function Body({ data, render }) {
  if (!data.length) return <Empty>No Data to Show at the moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.PrintHeader = PrintHeader;
Table.PrintHeaderBorder = PrintHeaderBorder;
Table.Row = Row;
Table.PrintRow = PrintRow;
Table.PrintRowBorder = PrintRowBorder;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
