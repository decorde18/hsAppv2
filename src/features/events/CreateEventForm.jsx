import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';

import Calendar from '../Calendar/Calendar';
import Spinner from '../../ui/Spinner';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useSeason } from '../seasons/useSeasons';
import { useCreateEvent, useEditEvent } from './useEvents';
import { useLocations } from '../locations/useLocations';
import { createEditGoogleCalendarEvent } from '../../services/apiGoogle';
// import { calendar } from 'googleapis/build/src/apis/calendar';

import { convertToGoogleDateTime } from '../../utils/helpers';

const Div = styled.div`
  height: 100%;
`;
const Center = styled.div`
  width: 50%;
  margin: auto;
`;
const Header = styled.header`
  display: flex;
  gap: 5rem;
  justify-content: center;
`;
const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;
const Flex = styled.div`
  display: flex;
  max-height: 90vh;
`;
const MainForm = styled.div`
  width: 70rem;
  margin: 2rem;
  overflow-y: auto;
`;

function CreateEventForm({ eventToEdit = {}, onCloseModal }) {
  const { isLoading: isLoadingSupabase } = useSessionContext();
  const session = useSession();

  const { isLoadingSeason, season } = useSeason();
  const { isLoadingLocations, locations } = useLocations();

  const { id: editId, ...editValues } = eventToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    setValue,
    watch,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { isCreating, createEvent } = useCreateEvent();
  const { isEditing, editEvent } = useEditEvent();
  const [googleUpdating, setGoogleUpdating] = useState(false);

  const { errors } = formState;

  const isLoading =
    isLoadingSeason ||
    googleUpdating ||
    isLoadingSupabase ||
    isLoadingLocations;
  const isWorking = isLoading || isCreating || isEditing || googleUpdating;

  const [buttons, setButtons] = useState({
    allDayValue: false,
    seasonPhaseValue: false,
  });
  const [startDate, setStartDate] = useState(new Date()); //state values for Calenader Page
  const [endDate, setEndDate] = useState(new Date()); //state values for Calenader Page

  useEffect(
    // on load
    function () {
      if (isLoading) return;
      setStartDate(new Date(`8/1/${season.season}`));
      setEndDate(new Date(`10/31/${season.season}`));
      if (isEditSession) {
        setButtons({
          seasonPhaseValue: watch('seasonPhase'),
          allDayValue: watch('allDay'),
        });
      } else {
        setValue('allDay', buttons.allDayValue);
        setValue('seasonPhase', buttons.seasonPhaseValue);
      }
    },
    [isLoading]
  );

  function handleButtonClick(e) {
    e.preventDefault();
    const name = e.target.name;
    setButtons({ ...buttons, [`${name}Value`]: !buttons[`${name}Value`] });
    handleSetValue(name, !getValues(name));
  }
  function handleSelectChange(e) {
    const name = e.target.name;
    const value = +e.target.value;
    handleSetValue(name, value);
  }
  function handleSetValue(name, value) {
    setValue(name, value);
  }

  function onSubmit(data) {
    const { created_at, updated_at, ...newData } = data;
    setGoogleUpdating(true);
    newData.location === 'default' && delete newData.location;
    if (isEditSession) {
      //send to googleAPI
      sendToCalendar(newData);
      editEvent(
        {
          newEventData: {
            ...newData,
          },
          id: editId,
        },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      sendToCalendar(newData);
    }
    async function sendToCalendar(calData) {
      const { calendarType, startDateTime, endDateTime, ...googleCalData } =
        calData;
      googleCalData.startDateTime = convertToGoogleDateTime(startDateTime);
      googleCalData.endDateTime = convertToGoogleDateTime(endDateTime);
      googleCalData.calendar =
        calendarType === 'all' ? 'ihsSoccer' : calendarType;
      //send to googleAPI and return calId
      createEditGoogleCalendarEvent(
        {
          ...googleCalData,
        },
        isEditSession
      )
        .then((data) => {
          setGoogleUpdating(false);
          if (isEditSession) return;
          //send to supabase with calId
          createEvent({
            ...calData,
            season: season.id,
            calId: data.id,
          });
        })
        .then(() => closeModal());
    }
  }
  function closeModal() {
    reset();
    onCloseModal?.();
  }
  function onError(errors) {
    console.log(errors);
  }
  if (isLoading || isWorking) return <Spinner />;
  if (!session?.provider_token) return <CreateGoogleSignedInError />;

  return (
    <Div>
      <Flex>
        <Calendar startDate={startDate} endDate={endDate} />
        <MainForm>
          <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={closeModal ? 'Modal' : 'regular'}
          >
            <FormRow label="Team Type *" error={errors?.calendarType?.message}>
              <StyledSelect
                type="white"
                id="calendarType"
                {...register('calendarType')}
                defaultValue="all"
              >
                <option value="all">All Teams</option>
                {season.teamLevels.map((team) => {
                  return (
                    <option value={team} key={`${team}select`}>
                      {team}
                    </option>
                  );
                })}
              </StyledSelect>
            </FormRow>
            <FormRow label="Title *" error={errors?.summary?.message}>
              <Input
                type="text"
                id="summary"
                disabled={isWorking}
                register={{
                  ...register('summary', {
                    required: 'This field is required',
                  }),
                }}
              />
            </FormRow>
            <FormRow
              label="Start Date *"
              error={errors?.startDateTime?.message}
            >
              <Input
                type="datetime-local"
                id="startDateTime"
                disabled={isWorking}
                register={{
                  ...register('startDateTime', {
                    required: 'Please Provide a date and Time',
                  }),
                }}
              />
            </FormRow>
            <FormRow label="End Date *" error={errors?.endDateTime?.message}>
              <Input
                type="datetime-local"
                id="endDateTime"
                disabled={isWorking}
                register={{
                  ...register('endDateTime', {
                    required: 'Please Provide a date and Time',
                  }),
                }}
              />
            </FormRow>
            <FormRow error={errors?.allDay?.message}>
              <Button
                size="small"
                name="allDay"
                value={buttons.allDayValue}
                variation={buttons.allDayValue ? 'primary' : 'secondary'}
                onClick={handleButtonClick}
              >
                {watch('allDay') ? 'All Day Event' : 'Click if All Day Event'}
              </Button>
              <input
                type="hidden"
                defaultValue={buttons.allDayValue}
                disabled={isWorking}
                {...register('allDay')}
              />
            </FormRow>
            <FormRow label="Details" error={errors?.description?.message}>
              <Textarea
                id="description"
                disabled={isWorking}
                {...register('description')}
              />
            </FormRow>
            <FormRow label="Location" error={errors?.location?.message}>
              <StyledSelect
                type="white"
                id="location"
                {...register('location')}
                onChange={handleSelectChange}
                defaultValue={'default'}
              >
                <option value="default" disabled>
                  Please Select Location
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </StyledSelect>
            </FormRow>
            <FormRow error={errors?.seasonPhase?.message}>
              <Button
                size="small"
                name="seasonPhase"
                value={buttons.seasonPhaseValue}
                variation={buttons.seasonPhaseValue ? 'primary' : 'secondary'}
                onClick={handleButtonClick}
              >
                {watch('seasonPhase')
                  ? 'Season Phase'
                  : 'Click if it is a Season Phase'}
              </Button>
              <input
                type="hidden"
                value={buttons.seasonPhaseValue}
                disabled={isWorking}
                {...register('seasonPhase')}
              />
            </FormRow>
            {/* submit buttons */}
            <FormRow>
              <Button
                variation="secondary"
                type="reset"
                onClick={() => closeModal?.()}
              >
                Cancel
              </Button>
              <Button disabled={isWorking}>
                {isEditSession ? 'Edit Event' : 'Create New Event'}
              </Button>
            </FormRow>
          </Form>
        </MainForm>
      </Flex>
    </Div>
  );
}

export default CreateEventForm;
