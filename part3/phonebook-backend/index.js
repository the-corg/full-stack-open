require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("json", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);

const errorBadRequest = (response, message) =>
  response.status(400).json({ error: message });

const errorNotFound = (response, message) =>
  response.status(404).json({ error: message });

app.get("/api/persons", (request, response, next) =>
  Person.find({})
    .then((result) => response.json(result))
    .catch((error) => next(error))
);

app.get("/info", (request, response, next) =>
  Person.countDocuments({})
    .then((result) =>
      response.send(
        `<p>Phonebook has info for ${result} ${
          result === 1 ? "person" : "people"
        }</p><p>${new Date().toString()}</p>`
      )
    )
    .catch((error) => next(error))
);

app.get("/api/persons/:id", (request, response, next) =>
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else return errorNotFound(response, "Person not found");
    })
    .catch((error) => next(error))
);

app.delete("/api/persons/:id", (request, response, next) =>
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error))
);

/*const generateId = () => {
  let newId = "";
  do newId = String(Math.floor(Math.random() * 1000000000) + 1);
  while (persons.find((p) => p.id === newId));
  return newId;
};*/

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  /*if (!body.name) return errorBadRequest(response, "Name missing");
  if (!body.number) return errorBadRequest(response, "Number missing");*/

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) return errorNotFound(response, "Person not found");

      person.name = name;
      person.number = number;

      return person
        .save()
        .then((updatedPerson) => response.json(updatedPerson));
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) =>
  errorNotFound(response, "Unknown endpoint");

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error("Error:", error.message);

  if (error.name === "CastError")
    return errorBadRequest(response, "malformatted id");

  if (error.name === "ValidationError")
    return errorBadRequest(response, error.message);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error)
    return errorBadRequest(response, error.message);

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}\n${new Date().toString()}`)
);
