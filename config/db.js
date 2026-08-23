import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB is connected successfuly');
    }
    catch(error){
        console.error('DB error',error.message);
        process.exit(1);
    }
};

export default connectDB;