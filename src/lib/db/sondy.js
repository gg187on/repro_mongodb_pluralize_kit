import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Sonda_schema = new Schema({
	something: String
});

const Sonda = model('sondy', Sonda_schema);

export default Sonda;
