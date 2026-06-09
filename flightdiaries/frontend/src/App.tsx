import { useEffect, useState } from 'react'
import { getAll, create, type DiaryEntry, type NewDiaryEntry, type Weather, type Visibility } from './services/diaries'

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [date, setDate] = useState<string>('')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [visibility, setVisibility] = useState<Visibility>('great')
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true)
      try {
        const data = await getAll()
        setDiaries(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    void fetchDiaries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setCreateError(null)

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment: comment || undefined,
    }

    try {
      const created = await create(newEntry)
      setDiaries(prev => prev.concat(created))
      setDate('')
      setWeather('sunny')
      setVisibility('great')
      setComment('')
    } catch (err) {
      setCreateError((err as Error).message)
    }
  }

  if (loading) return <div>Loading diaries...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Flight Diaries</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        {createError ? <div style={{ color: 'red', marginBottom: 8 }}>Error: {createError}</div> : null}
        <div>
          <label>
            Date:{' '}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
        </div>
        <fieldset>
          <legend>Weather</legend>
          <label>
            <input type="radio" name="weather" value="sunny" checked={weather === 'sunny'} onChange={e => setWeather(e.target.value as Weather)} /> sunny
          </label>
          <label>
            <input type="radio" name="weather" value="rainy" checked={weather === 'rainy'} onChange={e => setWeather(e.target.value as Weather)} /> rainy
          </label>
          <label>
            <input type="radio" name="weather" value="cloudy" checked={weather === 'cloudy'} onChange={e => setWeather(e.target.value as Weather)} /> cloudy
          </label>
          <label>
            <input type="radio" name="weather" value="stormy" checked={weather === 'stormy'} onChange={e => setWeather(e.target.value as Weather)} /> stormy
          </label>
          <label>
            <input type="radio" name="weather" value="windy" checked={weather === 'windy'} onChange={e => setWeather(e.target.value as Weather)} /> windy
          </label>
        </fieldset>
        <fieldset>
          <legend>Visibility</legend>
          <label>
            <input type="radio" name="visibility" value="great" checked={visibility === 'great'} onChange={e => setVisibility(e.target.value as Visibility)} /> great
          </label>
          <label>
            <input type="radio" name="visibility" value="good" checked={visibility === 'good'} onChange={e => setVisibility(e.target.value as Visibility)} /> good
          </label>
          <label>
            <input type="radio" name="visibility" value="ok" checked={visibility === 'ok'} onChange={e => setVisibility(e.target.value as Visibility)} /> ok
          </label>
          <label>
            <input type="radio" name="visibility" value="poor" checked={visibility === 'poor'} onChange={e => setVisibility(e.target.value as Visibility)} /> poor
          </label>
        </fieldset>
        <div>
          <label>
            Comment:{' '}
            <input value={comment} onChange={e => setComment(e.target.value)} />
          </label>
        </div>
        <button type="submit">Add Diary</button>
      </form>

      <ul>
        {diaries.map(d => (
          <li key={d.id}>
            <strong>{d.date}</strong> — {d.weather} / {d.visibility}
            {d.comment ? <div>{d.comment}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
