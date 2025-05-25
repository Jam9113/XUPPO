const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/inventorydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schema
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number
});
const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/inventory', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/api/inventory', async (req, res) => {
  const { name, quantity } = req.body;
  const newItem = new Item({ name, quantity });
  await newItem.save();
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const updated = await Item.findByIdAndUpdate(id, { quantity }, { new: true });
  res.json(updated);
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

