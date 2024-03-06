import ScheduleTable from '../features/games/ScheduleTable';
import AppLayoutPublic from '../features/layout/AppLayoutPublic';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Logo from '../ui/Logo';
import styled from 'styled-components';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
const StyledLogo = styled.div`
  @media print {
    display: none;
  }
`;
const StyledDiv = styled.div`
  @media screen {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    align-content: center;
    justify-content: center;
    gap: 3.2rem;
    background-color: var(--color-grey-50);
  }
`;

function Schedule() {
  return (
    <StyledDiv>
      <StyledLogo>
        <Logo />
      </StyledLogo>
      <ScheduleTable />
    </StyledDiv>
  );
}

export default Schedule;
