type Rating = 1 | 2 | 3;

interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
}

const ratingDescriptions = [
  'I find your lack of exercise disturbing',
  'not too bad but could be better',
  'impressive, most impressive',
];

const calculateExercises = (dailyExerciseHours: number[], target: number): Result => {
  const average: number = dailyExerciseHours.reduce((a, b) => a + b) / dailyExerciseHours.length;
  const rating: Rating = average >= target ? 3 : average >= 0.5 * target ? 2 : 1;
  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter(a => a > 0).length,
    success: average >= target,
    rating,
    ratingDescription: ratingDescriptions[rating - 1],
    target,
    average,
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
