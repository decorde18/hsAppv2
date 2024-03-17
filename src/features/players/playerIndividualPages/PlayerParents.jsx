import styled from 'styled-components';

import { useData } from '../../../services/useUniversal';

import { convertToPhoneNumber } from '../../../utils/helpers';

import Heading from '../../../ui/Heading';

const Main = styled.section`
  padding: 2rem;
  overflow: auto;
`;
const Flex = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
`;
const SubFlex = styled.div`
  width: 100%;
  display: flex;
  gap: 0.25rem;
`;
const Value = styled.div`
  font-weight: 700;
`;

function PlayerParents({ player }) {
  const parents = useData({
    table: 'playerParents',
    filter: [{ field: 'player', value: player.playerId }],
  });
  if (parents.isLoading) return;

  return (
    <>
      <Heading as="h2" case="upper" location="center">
        PARENTS
      </Heading>
      <Main>
        {parents.data.map((parent) => {
          const cellNumber = convertToPhoneNumber(parent.cellNumber);
          return (
            <Flex key={`parent-id-${parent.id}`}>
              <SubFlex>
                <div>Parent:</div>
                <Value>{`${parent.firstName} ${parent.lastName}`}</Value>
              </SubFlex>
              <SubFlex>
                <div>Email:</div>
                <Value>{parent.email}</Value>
              </SubFlex>
              <SubFlex>
                <div>Cell:</div>
                <Value>{cellNumber}</Value>
              </SubFlex>
            </Flex>
          );
        })}
      </Main>
    </>
  );
}

export default PlayerParents;
