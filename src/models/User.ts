import mongoose, {Schema,Document} from 'mongoose';

export interface Message extends Document {
    content : string;
    createdAt : Date;
}

const MessageSchema:Schema<Message> = new Schema({
    content : {type : String, required : true},
    createdAt : {type : Date, default : Date.now}
});

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    isVerified : boolean;
    verifyCode : string;
    verifyCodeExpire : Date;
    isAcceptingMessages : boolean;
    messages : Message[];
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,'Please fill a valid email address']
    
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String
    },

    verifyCodeExpire:{
        type:Date
    },

    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
});

export const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',UserSchema);
