// models/Image.js
const mongoose = require('mongoose');

// Định nghĩa schema cho ảnh
const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên file
  image: { data: Buffer, contentType: String }, // Dữ liệu ảnh
  uploadedAt: { type: Date, default: Date.now }, // Thời gian tải lên
});

module.exports = mongoose.model('Image', ImageSchema);
