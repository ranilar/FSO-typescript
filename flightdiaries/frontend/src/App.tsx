import { useEffect, useState } from 'react'
import { getAll, create, type DiaryEntry, type NewDiaryEntry } from './services/diaries'

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [date, setDate] = useState<string>('')
  const [weather, setWeather] = useState<string>('')
  const [visibility, setVisibility] = useState<string>('')
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
      weather: weather as any,
      visibility: visibility as any,
      comment: comment || undefined,
    }

    try {
      const created = await create(newEntry)
      setDiaries(prev => prev.concat(created))
      setDate('')
      setWeather('')
      setVisibility('')
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
            <input type="text" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Weather:{' '}
            <input type="text" value={weather} onChange={e => setWeather(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Visibility:{' '}
            <input type="text" value={visibility} onChange={e => setVisibility(e.target.value)} />
          </label>
        </div>
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
