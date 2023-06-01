
// Import mongoose library
const mongoose = require('mongoose');

const GoogleTrends= new mongoose.Schema({
    Week: String,
    Javascript: Number,
    Python: Number,
    Java: Number,
});
// Export schema
module.exports = mongoose.model('GoogleTrends', GoogleTrends, 'GoogleTrends');