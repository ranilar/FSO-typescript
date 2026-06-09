export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export interface NonSensitiveDiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

export interface NewDiaryEntry {
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export interface DiaryEntry extends NewDiaryEntry {
  id: number;
}

const baseUrl = '/api/diaries';

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const res = await fetch(baseUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch diaries');
  }
  const data = await res.json() as NonSensitiveDiaryEntry[];
  return data;
};

const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    throw new Error('Failed to create diary entry');
  }

  const data = await res.json() as DiaryEntry;
  return data;
};

export default { getAll };
export { getAll, create };
