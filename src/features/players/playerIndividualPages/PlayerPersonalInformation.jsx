import styled from 'styled-components';

import { convertToPhoneNumber, formatDate } from '../../../utils/helpers';

import Heading from '../../../ui/Heading';

const Main = styled.section`
  display: flex;
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

function PlayerPersonalInformation({ player }) {
  const cellNumber = convertToPhoneNumber(player.cellNumber);
  return (
    <>
      <Heading as="h2" case="upper" location="center">
        PERSONAL INFORMATION
      </Heading>
      <Main>
        <Flex>
          <SubFlex>
            <div>Player Name:</div>
            <Value>{player.fullname}</Value>
          </SubFlex>
          <SubFlex>
            <div>DOB:</div>
            <Value>
              {player.dateOfBirth && formatDate(new Date(player.dateOfBirth))}
            </Value>
          </SubFlex>
          <SubFlex>
            <div>Cell:</div>
            <Value>{cellNumber}</Value>
          </SubFlex>
          <SubFlex>
            <div>Email:</div>
            <Value>{player.email}</Value>
          </SubFlex>
          <SubFlex>
            <div>Year Entered 9th:</div>
            <Value>{player.entryYear}</Value>
          </SubFlex>
        </Flex>
      </Main>
    </>
  );
}

export default PlayerPersonalInformation;
