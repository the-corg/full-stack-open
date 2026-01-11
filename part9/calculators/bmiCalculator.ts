interface BmiInputValues {
  heightInCm: number;
  massInKg: number;
}

const bmiTable = [
  { limit: 16, label: 'Underweight (Severe thinness)' },
  { limit: 17, label: 'Underweight (Moderate thinness)' },
  { limit: 18.5, label: 'Underweight (Mild thinness)' },
  { limit: 25, label: 'Normal range' },
  { limit: 30, label: 'Overweight (Pre-obese)' },
  { limit: 35, label: 'Obese (Class I)' },
  { limit: 40, label: 'Obese (Class II)' },
  { limit: Infinity, label: 'Obese (Class III)' },
];

export const calculateBmi = (heightInCm: number, massInKg: number): string => {
  const bmi: number = (massInKg * 10000) / (heightInCm * heightInCm);

  for (let i = 0; i < bmiTable.length; i++) if (bmi < bmiTable[i].limit) return bmiTable[i].label;

  return 'Error. BMI greater than Infinity. Please contact emergency services immediately.';
};

const parseBmiArguments = (args: string[]): BmiInputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (args.slice(2, args.length).some(a => isNaN(Number(a))))
    throw new Error('Please provide two numbers as arguments: height in cm and body mass in kg');

  return {
    heightInCm: Number(args[2]),
    massInKg: Number(args[3]),
  };
};

if (require.main === module) {
  try {
    const { heightInCm, massInKg } = parseBmiArguments(process.argv);
    console.log(calculateBmi(heightInCm, massInKg));
  } catch (error: unknown) {
    let errorMessage = 'Something is wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
