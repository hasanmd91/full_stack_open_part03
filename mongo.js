const mongoose = require('mongoose')

const password = process.argv[2]
const Name = process.argv[3]
const Number = process.argv[4]

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = `mongodb+srv://hasanmd1991:${password}@cluster03.imekjjs.mongodb.net/contacts?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (!Name && !Number) {
  Contact.find({}).then((result) => {
    result.forEach((res) => {
      console.log(res)
    })
    mongoose.connection.close()
  })
} else {
  const contact = new Contact({
    name: Name,
    number: Number,
  })

  contact.save().then(() => {
    console.log(`added ${Name} number ${Number} to phonebook`)
    mongoose.connection.close()
  })
}
