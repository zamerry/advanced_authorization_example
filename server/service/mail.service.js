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
                user: "zumabekovtamerlan11@gmail.com",
                pass: "sikj vvjh lcip nudc"
            }
    })
    }


    async sendActivationMail(to, link) {
        await this.transport.sendMail({
            from: "zumabekovtamerlan11@gmail.com",
            to,
            subject: "активация аккаунта на " + process.env.api_url,
            text: '',
            html: `<a href="${link}">${link}</a>`
        })
    }
}

export default new MailService()