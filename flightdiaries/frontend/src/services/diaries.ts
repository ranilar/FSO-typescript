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
    const ct = res.headers.get('content-type') || '';
    let errorMessage = `Request failed with status ${res.status}`;
    try {
        if (ct.includes('application/json')) {
          const body = await res.json();
          if (body && body.error) {
            if (typeof body.error === 'string') {
              errorMessage = body.error;
            } else if (Array.isArray(body.error)) {
              const issues = body.error;
              const messages: string[] = issues.map((issue: any) => {
                const path = Array.isArray(issue.path) ? issue.path.join('.') : (issue.path ?? '')
                if (issue.message) {
                  return path ? `${path}: ${issue.message}` : issue.message
                }

                if (issue.code === 'invalid_type') {
                  return `${path}: Invalid type`
                }
                if (issue.code === 'invalid_literal') {
                  return `${path}: Invalid literal`
                }
                if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_value') {
                  if (issue.values) return `${path}: Invalid option, expected one of ${issue.values.join(', ')}`
                  return `${path}: Invalid value`
                }
                if (issue.code === 'invalid_string') {
                  return `${path}: Invalid string`
                }
                if (issue.code === 'invalid_format') {
                  if (issue.format === 'date') return `${path}: Invalid date, must be yyyy-mm-dd`
                  return `${path}: Invalid format (${issue.format})`
                }

                return JSON.stringify(issue)
              })

              errorMessage = messages.join('; ')
            } else {
              errorMessage = JSON.stringify(body.error)
            }
          } else {
            errorMessage = JSON.stringify(body)
          }
      } else {
        const text = await res.text();
        if (text) errorMessage = text;
      }
    } catch (e) {
    }

    throw new Error(errorMessage);
  }

  const data = await res.json() as DiaryEntry;
  return data;
};

export default { getAll };
export { getAll, create };
