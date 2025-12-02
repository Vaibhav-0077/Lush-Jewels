import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pin: String,
  items: Array,
  total: Number,
  paymentMethod: { type: String, required: true }, // 🆕 Add this line
  date: { type: Date, default: Date.now },
});


export default mongoose.model("Order", orderSchema);


