const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  category: {
    type: String,
    default: "", // Optional
  },
  isCashIn: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model("Entry", entrySchema);
