import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";
import messageService from "./services/messages";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
        let id = persons[existingIndex].id;
        personService
          .update(id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === id ? returnedPerson : person
              )
            );
            messageService.showNotification(
              setMessage,
              `${returnedPerson.name}'s phone number has been successfully updated`
            );
          })
          .catch((error) => {
            console.log(error.response.data.error);
            messageService.showError(
              setErrorMessage,
              error.response.data.error
            );

            /*setPersons(persons.filter((p) => p.id !== id));*/
          });
      }
      return;
    }

    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        messageService.showNotification(
          setMessage,
          `${returnedPerson.name} has been successfully added`
        );
      })
      .catch((error) => {
        console.log(error.response.data.error);
        messageService.showError(setErrorMessage, error.response.data.error);
      });
  };

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        messageService.showNotification(
          setMessage,
          `${person.name} has been successfully deleted`
        );
      })
      .catch(() => {
        messageService.showError(
          setErrorMessage,
          `${person.name} was already removed from the server`
        );

        setPersons(persons.filter((p) => p.id !== person.id));
      });
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
      <Notification message={message} />
      <Notification message={errorMessage} isError="true" />
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
