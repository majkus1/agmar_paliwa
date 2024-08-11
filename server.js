// server.js

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

mongoose
	.connect('mongodb+srv://michalipka1:W1Y5B6PvP8gRHSOe@cluster0.oyprett.mongodb.net/?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB Connected!'))
	.catch(error => {
		console.log(`DB Connection Error: ${error.message}`)
	})

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
})

const FuelPriceSchema = new mongoose.Schema({
	price: String,
})

const DatePriceSchema = new mongoose.Schema({
	datprice: String
  });

const User = mongoose.model('User', UserSchema)
const FuelPrice = mongoose.model('FuelPrice', FuelPriceSchema)
const DatePrice = mongoose.model('DatePrice', DatePriceSchema)

app.post('/login', async (req, res) => {
	const { username, password } = req.body

	const user = await User.findOne({ username })

	if (!user) {
		return res.status(400).json({ error: 'User not found' })
	}

	if (!bcrypt.compareSync(password, user.password)) {
		return res.status(400).json({ error: 'Invalid password' })
	}

	const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: 86400 })

	return res.json({ token })
})

app.get('/fuel-price', async (req, res) => {
	const fuelPrice = await FuelPrice.findOne();
  
	if (!fuelPrice) {
	  return res.status(404).json({ error: 'Fuel price not found' });
	}
  
	return res.json({ price: fuelPrice.price });
  });
  
  app.get('/date-price', async (req, res) => {
	const datePrice = await DatePrice.findOne();
  
	if (!datePrice) {
	  return res.status(404).json({ error: 'Date price not found' });
	}
  
	return res.json({ datprice: datePrice.datprice });
  });
  
  
  app.put('/fuel-price', async (req, res) => {
	const { price } = req.body;
  
	const token = req.headers.authorization;
  
	try {
	  const decoded = jwt.verify(token, 'secret');
  
	  const updatedPrice = await FuelPrice.findOneAndUpdate({}, { price }, { new: true });
  
	  if (!updatedPrice) {
		return res.status(404).json({ error: 'Fuel price not found' });
	  }
  
	  return res.json({ price: updatedPrice.price });
	} catch {
	  return res.status(401).json({ error: 'Invalid token' });
	}
  });
  
  app.put('/date-price', async (req, res) => {
	const { datprice } = req.body;
  
	const token = req.headers.authorization;
  
	try {
	  const decoded = jwt.verify(token, 'secret');
  
	  const updatedDatePrice = await DatePrice.findOneAndUpdate({}, { datprice }, { new: true, upsert: true });
  
	  if (!updatedDatePrice) {
		return res.status(404).json({ error: 'Date price not found' });
	  }
  
	  return res.json({ datprice: updatedDatePrice.datprice });
	} catch {
	  return res.status(401).json({ error: 'Invalid token' });
	}
  });
  
  
  app.listen(5000, () => console.log('Server running on port 5000'));