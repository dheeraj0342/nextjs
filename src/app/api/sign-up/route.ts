import { sendVerificationEmail } from "@/helper/sendverificationEmail";
import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/User";
import bcrypt from 'bcryptjs';


export async function POST(request :Request) {
    await dbConnection();
    try {
        const {email,username,password} = await request.json();
        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "User already exists with this username"
            })
        }else{
            const existingUserByEmail=await UserModel.findOne(email)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return Response.json({
                        success: false,
                        message: "User already exists with this email"
                    },{status:400})
                }else{
                    const expiryDate = new Date();
                    expiryDate.setHours(expiryDate.getHours() + 1);
                    const hashedPassword = await bcrypt.hash(password, 12);
                    await UserModel.updateOne({
                        email
                    },{
                        verifyCode:otp,
                        verifyCodeExpire:expiryDate,
                        password:hashedPassword
                    })
                }
            }else{
                const hashedPassword = await bcrypt.hash(password, 12);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                
                const newUser = new UserModel({
                    email,
                    username,
                    password : hashedPassword,
                    isVerified : false,
                    verifyCode :otp,
                    verifyCodeExpire :expiryDate,
                    isAcceptingMessages : true,
                    messages : []
                })
                await newUser.save();
            }
            const emailResponse =await sendVerificationEmail(email,username,otp);
            if(!emailResponse.success){
                return Response.json({
                    success: false,
                    message: "Error in sending verification email"
                },{status:500})
            }
            return Response.json({
                success: true,
                message: "Email sent successfully. Please verify your email address."
            },{status:201})
        }
        
    } catch (error) {
        console.error("Error in sign-up route", error);
        return Response.json({
            success: false,
            message: "Error in sign-up route",
        },{
            status: 500
        })
    }
 
 
}