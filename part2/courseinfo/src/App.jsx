const Header = ({ name }) => <h1>{name}</h1>;

const Part = ({ name, exercise }) => (
  <p>
    {name} {exercise}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((p) => (
      <Part key={p.name} name={p.name} exercise={p.exercises} />
    ))}
  </>
);

const Total = ({ parts }) => {
  const sum = parts.reduce((sumSoFar, part) => sumSoFar + part.exercises, 0);
  return (
    <p>
      <b>total of {sum} exercises</b>
    </p>
  );
};

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "Redux",
        exercises: 11,
        id: 4,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
