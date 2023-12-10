import { useSearchParams } from 'react-router-dom';
import Select from './Select';

function FilterBy({ options, id, ...props }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterBy = searchParams.get(id) || props.default;

  function handleChange(e) {
    //SET FILTER IN SEARCH PARAMS
    searchParams.set(e.target.id, e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={filterBy}
      id={id}
    />
  );
}

export default FilterBy;
