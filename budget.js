const express2 = require('express');
const mongoose2 = require('mongoose');
const cors2 = require('cors');

const app2 = express2();
app2.use(cors2());
app2.use(express2.json());

mongoose2.connect('mongodb://localhost:27017/budgetdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Budget DB Connected'))
  .catch(err => console.error(err));

const BudgetSchema = new mongoose2.Schema({
  expense: String,
  amount: Number,
  type: String,
  category: String,
  notes: String
});
const Budget = mongoose2.model('Budget', BudgetSchema);

app2.get('/api/budget', async (req, res) => {
  const items = await Budget.find();
  res.json(items);
});

app2.post('/api/budget', async (req, res) => {
  const { expense, amount, type, category, notes } = req.body;
  const item = new Budget({ expense, amount, type, category, notes });
  await item.save();
  res.status(201).json(item);
});

app2.put('/api/budget/:id', async (req, res) => {
  const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app2.delete('/api/budget/:id', async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ message: 'Budget item deleted' });
});

app2.listen(3002, () => console.log('Budget service running on http://localhost:3002'));
