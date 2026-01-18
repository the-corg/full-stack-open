export const weatherValues = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as const;

export type Weather = (typeof weatherValues)[number];

export const visibilityValues = ['great', 'good', 'ok', 'poor'] as const;

export type Visibility = (typeof visibilityValues)[number];

export interface Entry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewEntry = Omit<Entry, 'id'>;
