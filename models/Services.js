const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  requiredTime: {
    type: String,
    required: true,
  },
  serviceInfo: {
    type: String,
    required: true,
  },
  includes: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  images: [{ type: String }],
});
