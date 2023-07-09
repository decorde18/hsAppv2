import PeopleTable from '../features/people/PeopleTable';
import Button from '../ui/Button';
import { useState } from 'react';
import CreatePeopleForm from '../features/people/CreatePeopleForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function People() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>Filter/Sort</p>
      </Row>
      <Row>
        <PeopleTable />
        <Button onClick={() => setShowForm((show) => !show)}>
          Add new Person
        </Button>
        {showForm && <CreatePeopleForm />}
      </Row>
    </>
  );
}

export default People;

function Cabins() {
  return <></>;
}
