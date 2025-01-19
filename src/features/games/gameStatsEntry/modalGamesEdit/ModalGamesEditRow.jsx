import Checkbox from '../../../../ui/Checkbox';
import Input from '../../../../ui/Input';
import Select from '../../../../ui/Select';
import Switch from '../../../../ui/Switch';

function GameStatsEditRow({ inputType, field, onChange, onBlur }) {
  switch (inputType) {
    case 'checked':
      return (
        <Checkbox
          checked={field.checked || field.value === true ? true : false}
          onChange={onChange}
          size={field.size}
          name={field.name}
        />
      );
    case 'switch':
      return (
        <Switch
          checked={field.checked || field.value === true ? true : false}
          onChange={onChange}
          name={field.name}
        />
      );

    case 'select':
      return (
        <Select
          key={field.key}
          options={field.options}
          onChange={onChange}
          value={field.value}
          disabled={false}
          name={field.name}
          placeholder={field.placeholder}
          onBlur={onBlur}
        />
      );
    default:
      return (
        <Input
          key={field.key}
          value={field.value}
          size={field.size}
          name={field.name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );
  }
}

export default GameStatsEditRow;
