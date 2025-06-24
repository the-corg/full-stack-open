const express = require("express");
const app = express();
app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const count = persons.length;
  response.send(
    `<p>Phonebook has info for ${count} ${
      count === 1 ? "person" : "people"
    }</p><p>${new Date().toString()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Person with id of ${id} could not be found`;
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  let newId = "";
  do newId = String(Math.floor(Math.random() * 1000000000) + 1);
  while (persons.find((p) => p.id === newId));
  return newId;
};

app.post("/api/persons", (request, response) => {
  const person = request.body;

  person.id = generateId();
  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}\n${new Date().toString()}`)
);
