import styled from 'styled-components';

import { spreadsheet } from './SpreadsheetVariables';

import Button from '../../ui/Button';
import Heading from '../../ui/Heading';
import FormRow from '../../ui/FormRow';
import { useState } from 'react';

const Page = styled.div`
  border: 1px solid var(--color-brand-600);
  border-radius: 2rem;
  padding: 10rem;

  display: flex;
  flex-direction: column;
  gap: 5rem;
`;
const StyledDiv = styled.div`
  padding: 2rem 0 0 0;
`;
function SummerCampRegistrationConfirmation({ campers }) {
  const { onlinePayLink, amount } = spreadsheet.find(
    (sheet) => sheet.spreadsheet === 'camps'
  ).data;
  const totalDue = amount * campers.length;

  const [payByCheck, setPayByCheck] = useState(false);

  function onlinePay() {
    setPayByCheck(false);
    window.location.replace(onlinePayLink);
  }
  return (
    <Page>
      <Heading as="h2" case="upper" location="center">
        thanks for registering
      </Heading>
      {payByCheck && (
        <div>
          <Heading as="h3">Please Remit Payment to:</Heading>
          <StyledDiv />
          <div>Independence Athletic Club (IAC)</div>
          <div>c/o Girls&#39; Soccer</div>
          <div>1776 Declaration Way</div>
          <div>Thompson&#39;s Station, TN 37179 </div>
        </div>
      )}
      <div>
        <Heading as="h3">You are registering:</Heading>
        <StyledDiv />
        {campers.map((camper, idx) => (
          <div key={idx}> {camper}</div>
        ))}
      </div>
      <FormRow>
        {!payByCheck && (
          <Button
            size="medium"
            variation="secondary"
            onClick={() => setPayByCheck(true)}
          >
            Pay By Check ${totalDue}
          </Button>
        )}
        <Button size="medium" variation="primary" onClick={onlinePay}>
          Pay Online ${totalDue}
        </Button>
      </FormRow>
    </Page>
  );
}

export default SummerCampRegistrationConfirmation;
