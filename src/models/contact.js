import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

mongoose.set('strictQuery', false);
const Url = process.env.MONGODB_URI;

mongoose
  .connect(Url)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((error) => {
    console.log(`error connecting to mongodb: ${error.message}`);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

contactSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
