import styled from 'styled-components';
import Button from '../../../ui/Button';
import { useContext } from 'react';
import { useStatsNavContext } from '../../../contexts/StatsNavContext';

const Container = styled.div`
  height: 100%;
  padding: 1.5rem;
  /* Other styles for positioning and background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* justify-content: space-around; */
  gap: 2rem;
  background-color: var(--color-grey-50);
  border-radius: 1rem;
`;

function StatsSideBar() {
  const { active, handleToggle, allButtons } = useStatsNavContext();
  const { sidebar: buttons } = allButtons;

  return (
    <Container>
      {buttons.map((button, index) => (
        <Button
          name={button}
          value={active}
          variation={button === active ? 'primary' : 'secondary'}
          onClick={handleToggle}
          key={`aside-${index}`}
          type="fullWidth"
        >
          {button}
        </Button>
      ))}
    </Container>
  );
}

export default StatsSideBar;
