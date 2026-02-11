
const mongoose = require('mongoose');




const connectDB = async () => {

    await mongoose.connect(
    "mongodb+srv://aryankood9_db_user:2MJMoj0phalGfTe1@nanastenode.qshwu6a.mongodb.net/devTinder"
)

} 

module.exports = connectDB

