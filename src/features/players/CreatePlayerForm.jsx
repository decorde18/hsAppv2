import { styled } from 'styled-components';
import { useForm } from 'react-hook-form';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { useCreatePeople } from '../people/useCreatePeople';
import { useCreatePlayerSeason } from './usePlayerSeasons';
import { useCreatePlayer } from './useCreatePlayer';
import { useEditPlayer } from './useEditPlayer';
import { useCreateParent, useCreatePlayerParent } from '../parents/useParents';

import Logo from '../../ui/Logo';

import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';

const Background = styled.div`
  background-image: url('public/teams/independence2023.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  min-width: 90vw;
  padding: 0 50px;
  overflow: hidden;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  /* margin: 0px auto 10px auto; */
  margin: 25px auto;
  max-width: 80vw;
  min-height: 90vh;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50px;
`;
const Div2 = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px auto 10px auto;
  max-width: 0.8fr;
  min-height: 1fr;
  border-radius: 50px;
`;
const H1 = styled.h1`
  opacity: 1;
  margin: 0 auto;
  font-size: 2.5rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--color-brand--2);
  text-transform: uppercase;
  padding: 20px 25px;
`;

function CreatePlayerForm() {
  const { register, handleSubmit, reset, getValues, formState, watch } =
    useForm();
  const { errors } = formState;

  const { currentSeason } = useCurrentSeason();

  const { isCreatingPeople, createPeople } = useCreatePeople();
  const { isCreatingPlayer, createPlayer } = useCreatePlayer();
  const { isCreatingParent, createParent } = useCreateParent();
  const { isCreatingPlayerParent, createPlayerParent } =
    useCreatePlayerParent();
  const { isCreatingPlayerSeason, createPlayerSeason } =
    useCreatePlayerSeason();
  const isWorking =
    isCreatingPeople ||
    isCreatingPlayer ||
    isCreatingParent ||
    isCreatingPlayerParent ||
    isCreatingPlayerSeason;

  function onSubmit(data) {}

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Background>
      <Logo />

      <Div>
        <H1>new player form</H1>
        <Div2>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="First Name *" error={errors?.firstName?.message}>
              <Input
                type="text"
                id="firstName"
                {...register('people.firstName', {
                  required: 'We need your first name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Last Name *" error={errors?.lastName?.message}>
              <Input
                type="text"
                id="lastName"
                {...register('people.lastName', {
                  required: 'We need your last name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Rising Grade *" error={errors?.grade?.message}>
              <select
                id="grade"
                {...register('grade', {
                  required: 'We need your grade',
                })}
                disabled={isWorking}
              >
                <option value="9">9th</option>
                <option value="10">10th</option>
                <option value="11">11th</option>
                <option value="12">12th</option>
              </select>
            </FormRow>
            <FormRow
              label="Previous School"
              error={errors?.previousSchool?.message}
            >
              <Input
                type="text"
                id="previousSchool"
                {...register('previousSchool', {
                  required: false,
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Email" error={errors?.email?.message}>
              <Input
                type="email"
                id="email"
                {...register('people.email', {
                  required: false,
                })}
                disabled={isWorking}
              />
            </FormRow>
            <Row>
              <Heading as="h2">Parent Information</Heading>
            </Row>
            <FormRow
              label="First Name *"
              error={errors?.parentfirstName?.message}
            >
              <Input
                type="text"
                id="parentfirstName"
                {...register('parentfirstName', {
                  required: 'We need the parent first name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow
              label="Last Name *"
              error={errors?.parentlastName?.message}
            >
              <Input
                type="text"
                id="parentlastName"
                {...register('parentlastName', {
                  required: 'We need the parent last name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Email *" error={errors?.parentemail?.message}>
              <Input
                type="email"
                id="parentemail"
                disabled={isWorking}
                {...register('parentemail', {
                  required: 'We need a parent Email',
                })}
              />
            </FormRow>
            <FormRow>
              <Button variation="secondary" type="reset">
                Cancel
              </Button>
              <Button disabled={isWorking}>Add to Email List</Button>
            </FormRow>
          </Form>
        </Div2>
      </Div>
    </Background>
  );
}

export default CreatePlayerForm;
