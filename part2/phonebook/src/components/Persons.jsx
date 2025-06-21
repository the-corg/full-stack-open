import Person from "./Person";

const Persons = ({ people }) =>
  people.map((person) => <Person key={person.id} person={person} />);

export default Persons;
