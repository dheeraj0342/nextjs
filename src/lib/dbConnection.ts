import mongoose from "mongoose";

export type connection ={
    isConnected?: number
}

const connection:connection = {};

async function dbConnection():Promise<void>{
    if(connection.isConnected){
        console.log('Using existing connection');
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI||"");
        connection.isConnected = db.connections[0].readyState;
        console.log("New connection created");
    }
    catch(err){
        console.log("Error connecting to DB",err);
        process.exit(1);
    }
}

export default dbConnection;