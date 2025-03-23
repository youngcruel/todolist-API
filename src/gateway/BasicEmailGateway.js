import nodemailer from 'nodemailer';           
import config from '../../config/config.js';    
import EmailGateway from './BasicEmailGateway.js';

class BasicEmailGateway extends EmailGateway {
    #instance;
    constructor() {
      super();
      this.transport = nodemailer.createTransport(config.mailConfig.basic);
    }
async sendRegistrationEmail (email, token) {     
    
    const confirmationLink = `http://localhost:8000/user/activate/${token}`; 
    const subject = "Registration Confirmation"; 
    const message = `Click on the link to confirm your registration: ${confirmationLink}`;                                       
    const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Benvenuto su Todolist!</h2>
            <p>Clicca sul pulsante qui sotto per confermare la tua registrazione:</p>
            <a href="${confirmationLink}" 
                style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
                Conferma il tuo account
            </a>
            <p>Oppure copia e incolla il seguente link nel tuo browser:</p>
            <p><a> href="${confirmationLink}">${confirmationLink}</a></p>
            <hr>
            <p style="color: #777;">Se non hai richiesto questa registrazione, ignora questa email.</p>
        </div>
    `;

    return await this.send(email, subject, message, htmlMessage);  
}
async send(email, subject, message, htmlMessage) {                      

    try {                                               
         return await this.transport.sendMail({
            from: `"Todolist service" <${config.mailConfig.basic.auth.user}>`, 
            to: email,                                  
            subject,    
            text: message,                                
            html: htmlMessage                           
        });
    } catch (error) { 
        console.error("Errore nell'invio dell'email:", error); 
    }
};
}
export default BasicEmailGateway;