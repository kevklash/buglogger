const mongoose = require ('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://buglogger:buglogger2021@cluster0.ztrrh.mongodb.net/buglogger?retryWrites=true&w=majority', 
        {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true,   
        })
        console.log('MongoDB is now connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB