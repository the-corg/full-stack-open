interface ExerciseInputValues {
  target: number;
  dailyExerciseHours: number[];
}

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

export const calculateExercises = (dailyExerciseHours: number[], target: number): Result => {
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

const parseExerciseArguments = (args: string[]): ExerciseInputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (args.slice(2, args.length).some(a => isNaN(Number(a))))
    throw new Error(
      'Please provide only numbers as arguments. The first argument should be your target.'
    );

  return {
    target: Number(args[2]),
    dailyExerciseHours: args.slice(3, args.length).map(a => Number(a)),
  };
};

if (require.main === module) {
  try {
    const { target, dailyExerciseHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyExerciseHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something is wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
