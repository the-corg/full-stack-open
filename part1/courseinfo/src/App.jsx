const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part, exercise }) => (
  <p>
    {part} {exercise}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((p) => (
      <Part key={p.name} part={p.name} exercise={p.exercises} />
    ))}
  </>
);

const Total = ({ parts }) => {
  let sum = 0;
  parts.forEach((p) => (sum += p.exercises));
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = {
    name: "Fundamentals of React",
    exercises: 10,
  };
  const part2 = {
    name: "Using props to pass data",
    exercises: 7,
  };
  const part3 = {
    name: "State of a component",
    exercises: 14,
  };
  const parts = [part1, part2, part3];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
