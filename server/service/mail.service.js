import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

class MailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.mail_email,
                pass: process.env.mail_pass
            }
    })
    }


    async sendActivationMail(to, link) {
        await this.transport.sendMail({
            from: process.env.mail_email,
            to,
            subject: "активация аккаунта на " + process.env.api_url,
            text: '',
            html: `<a href="${link}">${link}</a>`
        })
    }
}

export default new MailService()