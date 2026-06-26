const cors = require('cors')
const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(express.json())
morgan.token('body', (request) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ''
})
app.use(cors())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// Ejercicio 3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Ejercicio 3.2
app.get('/info', (request, response) => {
  const currentDate = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p>
  `)
})

// Ejercicio 3.3
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Ejercicio 3.4
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// Ejercicios 3.5 y 3.6
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  const nameExists = persons.some(
    (person) => person.name === body.name
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})