import styled from 'styled-components';
import Heading from '../../../ui/Heading';
import { useGetPlayerParents } from '../../parents/useParents';
import { convertToPhoneNumber } from '../../../utils/helpers';

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
  const { isLoadingPlayerParents, playerParents } = useGetPlayerParents();
  if (isLoadingPlayerParents) return;
  const parents = playerParents.filter(
    (parent) => parent.player === player.playerId
  );
  return (
    <>
      <Heading as="h2" case="upper" location="center">
        PARENTS
      </Heading>
      <Main>
        {parents.map((parent) => {
          const cellNumber = convertToPhoneNumber(
            parent.parents.people.cellNumber
          );
          return (
            <Flex key={`people-id-${parent.parents.people.id}`}>
              <SubFlex>
                <div>Parent:</div>
                <Value>{`${parent.parents.people.firstName} ${parent.parents.people.lastName}`}</Value>
              </SubFlex>
              <SubFlex>
                <div>Email:</div>
                <Value>{parent.parents.people.email}</Value>
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

// {
//   parent: 162,
//   player: 253,
//   created_at: '2022-12-20T18:22:00+00:00',
//   updated_at: '2022-12-20T18:22:00+00:00',
//   id: 920,
//   players: {
//     id: 253,
//     created_at: '2023-07-04T04:30:47.079996+00:00',
//     peopleId: 527,
//     entryYear: 2020,
//     previousSchool: null,
//     creditsNeeded: 22,
//     updated_at: null,
//     people: {
//       id: 527,
//       created_at: '2023-07-04T03:43:54.789442+00:00',
//       title: null,
//       firstName: 'Ella',
//       lastName: 'Agnitsch',
//       email: 'agnitell000@myplace.wcs.edu',
//       cellNumber: '6154901061',
//       otherLastName: null,
//       nickName: null,
//       updated_at: '2024-03-05T16:33:56.216479+00:00',
//       dateOfBirth: '2005-07-30',
//       gender: 'F',
//     },
//   },
//   parents: {
//     id: 162,
//     created_at: '2023-07-04T04:17:25.217058+00:00',
//     peopleId: 186,
//     updated_at: null,
//     people: {
//       id: 186,
//       created_at: '2023-07-04T03:43:54.789442+00:00',
//       title: null,
//       firstName: 'Amanda',
//       lastName: 'Agnitsch',
//       email: 'Amanda@amandasellsfranklin.com',
//       cellNumber: '8139281978',
//       otherLastName: null,
//       nickName: null,
//       updated_at: null,
//       dateOfBirth: null,
//       gender: null,
//     },
//   },
// },
