import Part from "./Part";

const Content = ({ parts }) => (
  <>
    {parts.map((p) => (
      <Part key={p.name} name={p.name} exercise={p.exercises} />
    ))}
  </>
);

export default Content;
