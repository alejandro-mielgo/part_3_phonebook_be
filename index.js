require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Contact = require('./models/contact')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


app.use(morgan(function (tokens, request, response) {
  console.log('response body', response.body)

  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
    JSON.stringify(request.body),
  ].join(' ')
}))

app.get('/', (request,response) => {
  response.send('<h1>Phonebook</h1><p>full stack open exercise</>')
})

app.get('/info', (request, response, next) => { //Get info
  Contact.find().then((contacts) => {
    const nContacts = contacts.length
    console.log('contacts', contacts.length)
    const date = new Date()
    console.log(nContacts)
    console.log(date)
    const l1 = '<h1>Phonebook</h1>'
    const l2 = `<p>Phonebook has info for ${nContacts} people</p>`
    const l3 = String(date)
    response.send(l1+l2+l3)
  }).catch(error =>  next(error))
})

app.get('/api/persons', (request, response, next) => { //get all
  Contact.find().then((contacts) => {
    response.json(contacts)  //esto es lo que devuelve
  }).catch(error =>  next(error))
})

app.get('/api/persons/:id', (request, response,next) => {  //get one
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact){
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request,response,next) => { //add contact
  const body = request.body
  const newContact = new Contact({
    name : body.name,
    number: body.number,
  })
  newContact.save().then(savedContact => {
    response.json(savedContact)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response, next ) => { //delete one
  Contact.findByIdAndDelete(request.params.id)
    .then(response.status(204).end())
    .catch( error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number
  }
  console.log('updated contact', contact)
  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))

})


// const validateContent = (person, existingPersons) => {
//     const namesArray = existingPersons.map(person =>person.name)
//     if (!person.name){
//         return [false, "missing name"]
//     }
//     if(!person.number){
//         return [false, "missing number"]
//     }
//     if(namesArray.includes(person.name)){
//         return [false,"contact already in phonebook"]
//     }
//     return [true,"body is correct"]

// }


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name ==='ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
