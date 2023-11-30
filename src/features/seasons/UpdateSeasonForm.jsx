import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useUpdateSeason } from './useSeasons';
function UpdateSeasonForm({ season }) {
  const { isUpdating, updateSeason } = useUpdateSeason();

  function handleBlur(e, field) {
    const { value } = e.target;

    if (!value) return;
    updateSeason({ id: season.id, [field]: value });
  }

  return (
    <Form>
      <FormRow label="Season">
        <Input
          type="number"
          key={season.season}
          defaultValue={season.season}
          onBlur={(e) => handleBlur(e, 'season')}
          disabled={isUpdating}
          id="season"
        />
      </FormRow>
      <FormRow label="School Year">
        <Input
          type="text"
          key={season.schoolYear}
          defaultValue={season.schoolYear}
          onBlur={(e) => handleBlur(e, 'schoolYear')}
          disabled={isUpdating}
          id="schoolYear"
        />
      </FormRow>
      <FormRow label="Class">
        <Input
          type="text"
          key={season.classification}
          defaultValue={season.classification}
          onBlur={(e) => handleBlur(e, 'classification')}
          disabled={isUpdating}
          id="classification"
        />
      </FormRow>
      <FormRow label="Region">
        <Input
          type="number"
          key={season.region}
          defaultValue={season.region}
          onBlur={(e) => handleBlur(e, 'region')}
          disabled={isUpdating}
          id="region"
        />
      </FormRow>
      <FormRow label="District">
        <Input
          type="number"
          key={season.district}
          defaultValue={season.district}
          onBlur={(e) => handleBlur(e, 'district')}
          disabled={isUpdating}
          id="district"
        />
      </FormRow>

      <FormRow label="Team Levels">
        <Input
          type="text"
          key={season.teamLevels}
          defaultValue={season.teamLevels}
          onBlur={(e) => handleBlur(e, 'teamLevels')}
          disabled={isUpdating}
          id="teamLevels"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSeasonForm;
