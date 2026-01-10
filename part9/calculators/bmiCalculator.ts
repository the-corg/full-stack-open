interface BmiInputValues {
  heightInCm: number;
  massInKg: number;
}

export const calculateBmi = (heightInCm: number, massInKg: number): string => {
  const bmi: number = (massInKg * 10000) / (heightInCm * heightInCm);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  if (bmi < 17) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight (Pre-obese)';
  if (bmi < 35) return 'Obese (Class I)';
  if (bmi < 40) return 'Obese (Class II)';
  return 'Obese (Class III)';
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
