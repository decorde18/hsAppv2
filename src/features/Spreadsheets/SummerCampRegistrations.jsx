import { useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { useState } from 'react';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import styled from 'styled-components';
import Heading from '../../ui/Heading';
import Textarea from '../../ui/Textarea';

const Background = styled.div`
  background-color: var(--color-brand--1);
`;
const Container = styled.div`
  /* background-color: red; */
  min-width: 40rem;
  max-width: 100rem;
  margin: 0 auto;
  padding: 2rem;
  overflow: auto;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, auto);
`;
const Section = styled.div`
  padding-top: 3rem;
`;
const CampSelection = styled.div`
  padding: 2rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;
const fields = [
  {
    field: 'Participant_First_Name',
    label: 'Player First Name',
    type: 'text',
    size: 25,
    message: 'The first name is required',
    required: true,
    section: 'player',
  },
  {
    field: 'Participant_Last_Name',
    label: 'Player Last Name',
    type: 'text',
    size: 25,
    message: 'The last name is required',
    required: true,
    section: 'player',
  },
  {
    field: 'Grade',
    label: 'Rising Grade',
    type: 'number',
    size: 25,
    message: 'The grade is required',
    required: true,
    fieldType: 'select',
    section: 'player',
  },
  {
    field: 'T_shirt_size',
    label: 'T-Shirt Size',
    type: 'text',
    size: 25,
    message: 'The t-shirt size is required',
    required: true,
    fieldType: 'select',
    section: 'player',
  },
  {
    field: 'Parent_Name',
    label: 'Parent/Guardian Name',
    type: 'string',
    size: 25,
    message: 'The guardian name is required',
    required: true,
    section: 'parent',
  },
  {
    field: 'Parent_Email',
    label: 'Parent/Guardian Email',
    type: 'email',
    size: 25,
    message: 'The guardian email is required',
    required: true,
    section: 'parent',
  },
  {
    field: 'Parent_Phone',
    label: 'Parent/Guardian Phone',
    type: 'tel',
    size: 25,
    message: 'The guardian phone is required',
    required: true,
    section: 'parent',
  },
  {
    field: 'Parent_Name2',
    label: 'Emergency Contact (if different from above)',
    type: 'string',
    size: 25,
    message: 'An emergency contact person is required',
    required: false,
    section: 'parent',
  },
  {
    field: 'Parent_Phone2',
    label: 'Emergency Contact Phone (if different from above)',
    type: 'tel',
    size: 25,
    message: 'An emergency contact phone is required',
    required: false,
    section: 'parent',
  },
  // {
  //   field: 'Relationship_to_Participant',
  //   label: 'Relationship to the Player',
  //   type: 'string',
  //   size: 25,
  //   message: 'How does the emergency contact relate to the player',
  //   required: true,
  // },
  {
    field: 'authorization',
    label:
      'I hereby authorize the staff of the IHS Soccer Camp to act according to their best judgement in any emergency requiring medical treatment.',
    type: 'string',
    size: 25,
    message: 'Please Authorize',
    required: true,
    fieldType: 'select',
    section: 'authorization',
  },

  // {field:, label:, type:, size:, message:, required: },
];
const selectFields = [
  {
    field: 'T_shirt_size',
    values: [
      { value: '', label: 'SELECT A SIZE' },
      { value: 'YS', label: 'Youth Small' },
      { value: 'YM', label: 'Youth Medium' },
      { value: 'YL', label: 'Youth Large' },
      { value: 'AS', label: 'Adult Small' },
      { value: 'AM', label: 'Adult Medium' },
      { value: 'AL', label: 'Adult Large' },
    ],
  },
  {
    field: 'Grade',
    values: [
      { value: '', label: 'SELECT A GRADE', filter: 'Little Eagles Camp' },
      { value: 1, label: '1st grade', filter: 'Little Eagles Camp' },
      { value: 2, label: '2nd grade', filter: 'Little Eagles Camp' },
      { value: 3, label: '3th grade', filter: 'Little Eagles Camp' },
      { value: 4, label: '4th grade', filter: 'Little Eagles Camp' },
      { value: 5, label: '5th grade', filter: 'Little Eagles Camp' },
      { value: '', label: 'SELECT A GRADE', filter: 'Eagles Camp' },
      { value: 6, label: '6th grade', filter: 'Eagles Camp' },
      { value: 7, label: '7th grade', filter: 'Eagles Camp' },
      { value: 8, label: '8th grade', filter: 'Eagles Camp' },
    ],
  },
  {
    field: 'authorization',
    values: [
      { value: '', label: 'PLEASE AUTHORIZE' },
      { value: true, label: 'I AUTHORIZE' },
    ],
  },
];
const sections = [
  { name: 'player', title: 'Camper Information', columns: 2 },
  { name: 'parent', title: 'Parent Information', columns: 2 },
  { name: 'authorization', title: 'Authorization', columns: 1 },
];

function SummerCampRegistrations() {
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm();
  const { errors } = formState;

  const [selectedCamp, setSelectedCamp] = useState('Eagles Camp');
  const [selectFieldValues, setSelectFieldValues] = useState(
    selectFields.map((field) => ({ field: field.field, value: '' }))
  );
  const isWorking = false;

  function onSubmit(data) {
    data = {
      ...data,
      timestamp: new Date().toLocaleString().replace(',', ''),
    };

    const formData = Object.keys(data).map((key) => [key, data[key]]);
    fetch(
      'https://script.google.com/macros/library/d/1dUm2r6hhDRWwRF6D_mELmp9X73BLn2VOX0L_NXl7GZibH0A7tRFraXbU/2',
      { method: 'POST', body: formData }
    );
    console.log(formData);
  }
  function onError(errors) {
    console.log(errors);
  }
  function handleButtonGroupChange(e) {
    e.preventDefault();
    setSelectedCamp(e.target.name);
  }
  function handleSelectChange(e) {
    if (!e.target.value) return;

    setSelectFieldValues(
      selectFieldValues.map((val) =>
        val.field === e.target.name
          ? { field: val.field, value: e.target.value }
          : { ...val }
      )
    );
  }

  return (
    <Background>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit, onError)} type={'regular'}>
          <Heading as="h1" case="upper" location="center">
            Independence High School Summer Camps
          </Heading>
          <CampSelection>
            <div />
            <Heading as="h2" case="upper" location="center">
              CHOOSE YOUR CAMP:
              <ButtonGroup
                btnArray={['Eagles Camp', 'Little Eagles Camp']}
                defaultBtn={selectedCamp}
                onChange={handleButtonGroupChange}
              />
            </Heading>
            <div />
          </CampSelection>
          {sections.map((section) => (
            <Section key={section.name}>
              <Heading as="h2" case="upper" location="center">
                {section.title}
              </Heading>
              <Grid columns={section.columns}>
                {fields
                  .filter((each) => each.section === section.name)
                  .map((each) => (
                    <FormRow
                      label={each.label}
                      error={errors?.[each.field]?.message}
                      key={each.field}
                    >
                      {each?.fieldType !== 'select' ? (
                        <Input
                          type={each.type}
                          disabled={isWorking}
                          id={each.field}
                          register={{
                            ...register(each.field, {
                              required: each.required ? each.message : false,
                            }),
                          }}
                          size={each.size}
                          defaultValue={getValues(`${each.defaultValue}`)}
                          ref={null}
                        />
                      ) : (
                        <Select
                          width={each.size}
                          options={selectFields
                            .find((field) => field.field === each.field)
                            .values.map((val) => ({ ...val }))
                            .filter((field) =>
                              each.field === 'Grade'
                                ? field.filter === selectedCamp
                                : field
                            )}
                          onChange={handleSelectChange}
                          name={each.field}
                          disabled={isWorking}
                          value={
                            selectFieldValues.find(
                              (field) => field.field === each.field
                            ).value
                          }
                          register={{
                            ...register(each.field, {
                              validate: (value) =>
                                value !== '' || `${each.message}`,
                            }),
                          }}
                        />
                      )}
                    </FormRow>
                  ))}
              </Grid>
            </Section>
          ))}
          <Grid columns="1">
            <Heading as="h2" case="upper" location="center">
              Comments
            </Heading>
            <div>
              (please list any medical concerns, allergies, etc we need to know
              about)
            </div>
            <Textarea
              id="comments"
              disabled={isWorking}
              {...register('comments')}
            />
          </Grid>
          <FormRow>
            <Button variation="secondary" type="reset">
              Cancel
            </Button>
            <Button disabled={isWorking}>Register</Button>
          </FormRow>
        </Form>
      </Container>
    </Background>
  );
}

export default SummerCampRegistrations;
