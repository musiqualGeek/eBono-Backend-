const mongoose = require('mongoose')
const config = require('config')
// const db = config.get('mongoURI')
var mongoURI = 'mongodb+srv://vinay:vinay.123@cluster0.u5kok.mongodb.net/?retryWrites=true&w=majority'


const connectDB = async () => {
    try{
        await mongoose.connect(mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex: true
        })
        console.log('MongoDB Connected')
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDB