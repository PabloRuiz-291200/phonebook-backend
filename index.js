const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ''
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
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

// 3.1: obtener todas las personas
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2: información de la agenda
app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

// 3.3: obtener una persona
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (!person) {
    return response.status(404).end()
  }

  response.json(person)
})

// 3.4: eliminar una persona
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// 3.5 y 3.6: crear una persona y validar errores
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  const nameExists = persons.some(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number,
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})