import Person from "./Person";

const Persons = ({ people, deletePerson }) =>
  people.map((person) => (
    <Person
      key={person.id}
      person={person}
      deletePerson={() => deletePerson(person)}
    />
  ));

export default Persons;
