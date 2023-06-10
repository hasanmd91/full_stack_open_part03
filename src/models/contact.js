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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },

    required: [true, 'user phone number is required'],
  },
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
