const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  problemType: { type: String, required: true },
  summary: { type: String, required: true },
  facts: [{ type: String }],
  location: { type: String }, // City only
  documents: [{ type: String }], // Optional
  status: { type: String, enum: ['open', 'assigned'], default: 'open', index: true },
  assignedLawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);
