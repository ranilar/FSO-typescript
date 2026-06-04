import React from 'react'

interface CoursePartBase {
  name: string
  exerciseCount: number
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: 'basic'
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number
  kind: 'group'
}

interface CoursePartBackground extends CoursePartWithDescription {
  url: string
  kind: 'background'
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[]
  kind: 'special'
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial

const courseParts: CoursePart[] = [
  {
    name: 'Fundamentals',
    exerciseCount: 10,
    description: 'This is the leisured course part',
    kind: 'basic',
  },
  {
    name: 'Advanced',
    exerciseCount: 7,
    description: 'This is the harder course part',
    kind: 'basic'
  },
  {
    name: 'Using props to pass data',
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: 'group',
  },
  {
    name: 'Deeper type usage',
    exerciseCount: 14,
    description: 'Confusing description',
    url: 'https://fake-exercise-submit.made-up-url.dev',
    kind: 'background',
  },
  {
    name: 'Backend development',
    exerciseCount: 21,
    description: 'Typing the backend',
    requirements: ['nodejs', 'jest'],
    kind: 'special',
  },
]

type HeaderProps = {
  courseName: string
}

const Header: React.FC<HeaderProps> = ({ courseName }) => <h1>{courseName}</h1>

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
}

type PartProps = {
  part: CoursePart
}

const Part: React.FC<PartProps> = ({ part }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>{part.description}</div>
        </div>
      )
    case 'group':
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>project exercises {part.groupProjectCount}</div>
        </div>
      )
    case 'background':
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>{part.description}</div>
          <div>submit to: {part.url}</div>
        </div>
      )
    case 'special':
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>{part.description}</div>
          <div>required skills: {part.requirements.join(', ')}</div>
        </div>
      )
    default:
      return assertNever(part as never)
  }
}

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

