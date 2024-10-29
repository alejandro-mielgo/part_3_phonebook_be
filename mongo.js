const mongoose = require('mongoose')

const password = process.argv[2]


//Boiler plate to connect to db y plantilla de objeto a guardar
const url = `mongodb+srv://admin:${password}@notes.zcalr.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=contacts`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Contact = mongoose.model('Contact', contactSchema)

console.log(process.argv.length)

//control de flujo
if (process.argv.length===3){
  console.log('Phonebook:')
  Contact
    .find()
    .then( (result) => {
      result.forEach(person => {
        console.log( person.name, person.number)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length===5) { //escribir contacto

  const newContact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })
  newContact.save().then( result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}


// Note.find().then(result => {
//     result.forEach( note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })


