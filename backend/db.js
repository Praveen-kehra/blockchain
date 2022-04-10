const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || "MONGO_URL=mongodb+srv://proNation:proNation@cluster0.a6r6d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" || 
mongoose.connect(
    MONGO_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true}
);

const paymentSchema = new mongoose.Schema({
    id: String, 
    itemId: String,
    paid: Boolean
});

const Payment = mongoose.model('Payment', paymentSchema); 
module.exports = {
    Payment
}