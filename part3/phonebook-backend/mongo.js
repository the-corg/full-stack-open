const mongoose = require("mongoose");

if (![3, 5].includes(process.argv.length)) {
  console.log(
    "Usage:\nGet all entries: node mongo.js PASSWORD\nAdd a person: node mongo.js PASSWORD NAME NUMBER"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.y23pbq4.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  console.log("phonebook:");

  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("added", person.name, "number", person.number, "to phonebook");
    mongoose.connection.close();
  });
}
