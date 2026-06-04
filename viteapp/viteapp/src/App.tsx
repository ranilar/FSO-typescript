import React from 'react'

type CoursePart = {
  name: string
  exerciseCount: number
}

type HeaderProps = {
  courseName: string
}

const Header: React.FC<HeaderProps> = ({ courseName }) => <h1>{courseName}</h1>

type PartProps = {
  part: CoursePart
}

const Part: React.FC<PartProps> = ({ part }) => (
  <p>
    {part.name} {part.exerciseCount}
  </p>
)

type ContentProps = {
  parts: CoursePart[]
}

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((p, i) => (
      <Part key={i} part={p} />
    ))}
  </div>
)

type TotalProps = {
  total: number
}

const Total: React.FC<TotalProps> = ({ total }) => <p>Number of exercises {total}</p>

const App: React.FC = () => {
  const courseName = 'Half Stack application development'
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
    },
  ]

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0)

  return (
    <div>
      <Header courseName={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  )
}

export default App
