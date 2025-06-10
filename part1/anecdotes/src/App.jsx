import { useState } from "react";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Anecdote = ({ text, count }) => (
  <>
    <div>{text}</div>
    <div>
      has {count} vote{count !== 1 && "s"}
    </div>
  </>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const [selected, setSelected] = useState(0);

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
  };

  const maxVoted = votes.reduce(
    (indexOfMaxSoFar, currentValue, currentIndex, array) =>
      currentValue > array[indexOfMaxSoFar] ? currentIndex : indexOfMaxSoFar,
    0
  );

  return (
    <>
      <div>
        <h2>Anecdote of the day</h2>
        <Anecdote text={anecdotes[selected]} count={votes[selected]} />
        <div>
          <button onClick={handleVote}>vote</button>
          <button onClick={() => setSelected(getRandomInt(anecdotes.length))}>
            next
          </button>
        </div>
      </div>
      <div>
        <h2>Anecdote with most votes</h2>
        <Anecdote text={anecdotes[maxVoted]} count={votes[maxVoted]} />
      </div>
    </>
  );
};

export default App;
