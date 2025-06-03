import { useState } from "react";

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  if (all === 0) return <div>No feedback given</div>;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={(good - bad) / all} />
        <StatisticLine text="positive" value={(good * 100) / all + " %"} />
      </tbody>
    </table>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleRating = (rating, setRating) => () => {
    setRating(rating + 1);
  };

  return (
    <>
      <div>
        <h2>give feedback</h2>
        <Button onClick={handleRating(good, setGood)} text="good" />
        <Button onClick={handleRating(neutral, setNeutral)} text="neutral" />
        <Button onClick={handleRating(bad, setBad)} text="bad" />
      </div>
      <div>
        <h2>statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </>
  );
};

export default App;
