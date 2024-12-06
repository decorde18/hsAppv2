import styled from 'styled-components';

const Container = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
function StatsHeader({ buttons }) {
  return (
    <Container>
      <div>button</div>
      <div>button</div>
      <div>button</div>
    </Container>
  );
}

export default StatsHeader;
