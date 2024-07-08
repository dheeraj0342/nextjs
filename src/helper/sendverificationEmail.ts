import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import { VerificationEmail } from "../../emails/VerificationEmail";

export const sendVerificationEmail = async (email:string,username:string,otp:string) :Promise<ApiResponse>=> {
    try {
         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'blog-app | verification Code',
            text: 'Your verification code is: ' + otp,
            react: VerificationEmail({ username, otp}),
          });
          return {
            success: true,
            message: "Verification email sent successfully",
          }
    } catch (emailError) {
        console.error("Error in sending verification email", emailError);
        return {
            success: false,
            message: "Error in sending verification email",
        }
    }
}