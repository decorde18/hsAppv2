import styled from 'styled-components';
import { useStatsNavContext } from '../../../contexts/StatsNavContext';
import Button from '../../../ui/Button';

const Container = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
function StatsHeader() {
  const { active, handleToggle, allButtons } = useStatsNavContext();
  const { header } = allButtons;
  const { primary, secondary } = active;
  const buttons = header[primary];

  return (
    <Container>
      {buttons.map((button, index) => (
        <Button
          name={`${primary}-${button}`}
          value={secondary}
          variation={button === secondary ? 'primary' : 'secondary'}
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

export default StatsHeader;
