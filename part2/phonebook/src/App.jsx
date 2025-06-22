import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialData) => {
      setPersons(initialData);
    });
  }, []);

  const newPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    let existingIndex = persons.findIndex((person) => person.name === newName);
    if (existingIndex !== -1) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        personService
          .update(persons[existingIndex].id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
          });
      }
      return;
    }

    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;

    personService
      .remove(person.id)
      .then(() => setPersons(persons.filter((p) => p.id !== person.id)));
  };

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const peopleToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={filter} onChange={handleFilterChange} />
      <h3>Add new</h3>

      <PersonForm
        onSubmit={newPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNewNameChange}
        onNumberChange={handleNewNumberChange}
      />

      <h3>Numbers</h3>
      <Persons people={peopleToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
