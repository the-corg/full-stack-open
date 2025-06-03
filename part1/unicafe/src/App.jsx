import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleRating = (rating, setRating) => () => {
    setRating(rating + 1);
  };

  const all = good + neutral + bad;

  return (
    <>
      <div>
        <h2>give feedback</h2>
        <button onClick={handleRating(good, setGood)}>good</button>
        <button onClick={handleRating(neutral, setNeutral)}>neutral</button>
        <button onClick={handleRating(bad, setBad)}>bad</button>
      </div>
      <div>
        <h2>statistics</h2>
        <p>
          good {good}
          <br />
          neutral {neutral}
          <br />
          bad {bad}
          <br />
          all {all}
          <br />
          average {(good - bad) / all}
          <br />
          positive {(good * 100) / all} %
        </p>
      </div>
    </>
  );
};

export default App;
