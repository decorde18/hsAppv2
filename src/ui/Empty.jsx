import styled from 'styled-components';

const StyledP = styled.p`
  margin: auto;
`;

function Empty({ resource }) {
  return <StyledP>No {resource} could be found.</StyledP>;
}

export default Empty;
