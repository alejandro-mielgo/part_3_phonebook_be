console.log("Agenda telefonica back end")

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())


app.use(morgan(function (tokens, request, response) {
    console.log(response.body)

    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'), '-',
      tokens['response-time'](request, response), 'ms',
      JSON.stringify(request.body),
    ].join(' ')
  }))




let contacts = [ 
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response)=>{ //Get info

    const nContacts =  contacts.length
    const date = new Date()
    console.log(nContacts)
    console.log(date)
    const l1 = '<h1>Phonebook</h1>'
    const l2 = `<p>Phonebook has info for ${nContacts} people</p>`
    const l3 = String(date)
    response.send(l1+l2+l3)
    
   
})
app.get('/api/persons', (request, response) =>{ //get all
    response.json(contacts)
})
app.get('/api/persons/:id', (request, response) =>{  //get one
    const id = Number( request.params.id )
    const contact = contacts.filter(person => person.id===id)
    console.log(id)
    console.log(contact.id)
    response.json(contact)
})

app.post('/api/persons', (request,response) => { //add contact
    const body = request.body
    const [isBodyValid,message] =  validateContent(body, contacts)
    
    if(!isBodyValid){
        return response.json({error:message})
    }
    const contact = {
        name : body.name,
        number: body.number,
        id: generateId()
    }
    contacts = contacts.concat(contact)
    return response.json(contact)
})

app.delete('/api/persons/:id', (request,response)=>{ //delete one
    const id = Number(request.params.id)
    console.log(id)
    contacts = contacts.filter(person => person.id!==id )
    response.status(204).end()
})

const validateContent = (person, existingPersons) => {
    const namesArray = existingPersons.map(person =>person.name)
    if (!person.name){
        return [false, "missing name"]      
    }
    if(!person.number){
        return [false, "missing number"]
    }
    if(namesArray.includes(person.name)){
        return [false,"contact already in phonebook"]
    }
    return [true,"body is correct"]

}



const generateId = () => {
    return Math.floor(Math.random()*1000000)
  }


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
  