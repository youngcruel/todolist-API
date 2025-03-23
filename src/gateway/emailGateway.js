// import mailer from 'nodemailer';
// import config from '../../config/config.js';

// const sendRegistrationEmail = async (email, link) => {

//     const subject = "Registration Confirmation";
//     const message = `Please click on the link below to confirm your registration: ${link}`;

//     return await mailer.createTransport(config.mailConfig).sendMail({
//         from: `"Todolist service" <${config.mailConfig.auth.user}>`,
//         to: email,
//         subject,
//         text: message
//     });
// };

// export default { sendRegistrationEmail };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Questo codice è un modulo JavaScript che utilizza il pacchetto nodemailer per inviare email di conferma di registrazione


import nodemailer from 'nodemailer';            // Importa il modulo nodemailer per inviare email in node.js
import config from '../../config/config.js';    // Importa la configurazione del server e del database da config.js

const sendRegistrationEmail = async (email, token) => {      // Funzione asincrona che accetta un indirizzo email e un link di conferma come argomenti
    
    const confirmationLink = `http://localhost:8000/user/activate/${token}`; //Genera link di conferma

    const subject = "Registration Confirmation";                                        // Oggetto dell'email
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

    const transporter = nodemailer.createTransport(config.mailConfig);                          // Crea un oggetto transporter per inviare l'email
    // Transporter è un oggetto creato con nodemailer.createTransport utilizzando le configurazioni specificate in config.mailConfig.

    try {                                               // Blocco try: Tenta di inviare l'email di conferma usando transporter.sendMail con i dettagli dell'email.
        const result = await transporter.sendMail({
            from: `"Todolist service" <${config.mailConfig.auth.user}>`, // Indirizzo email del mittente
            to: email,                                  // Invia l'email all'indirizzo specificato con l'oggetto e il corpo del messaggio specificati.
            subject,                                    // Invia l'email all'indirizzo specificato con l'oggetto e il corpo del messaggio specificati.
            html: htmlMessage                           // Invia l'email all'indirizzo specificato con l'oggetto e il corpo del messaggio specificati.
        });
        return result; // Se l'email viene inviata con successo, restituisce il risultato.

    } catch (error) { // Blocco catch: Gestisce eventuali errori durante l'invio dell'email.
        console.error("Errore nell'invio dell'email:", error); // Stampa l'errore in console.
        return null; // Restituisce null se si verifica un errore durante l'invio dell'email.
    }
};

export default {sendRegistrationEmail}; // Esporta la funzione sendRegistrationEmail per poterla utilizzare in altri file dell'applicazione.

//In questo snippet di codice, ho creato un modulo JavaScript che utilizza il pacchetto nodemailer per inviare email di conferma di registrazione.
//Ho importato il modulo nodemailer per inviare email in node.js e la configurazione del server e del database da config.js.
//Ho creato una funzione asincrona sendRegistrationEmail che accetta un indirizzo email e un link di conferma come argomenti.
//Ho creato un oggetto transporter con nodemailer.createTransport utilizzando le configurazioni specificate in config.mailConfig.
//Ho utilizzato transporter.sendMail per inviare l'email di conferma con l'oggetto e il corpo del messaggio specificati.
//Ho gestito eventuali errori durante l'invio dell'email e restituito il risultato se l'email viene inviata con successo.
//Infine, ho esportato la funzione sendRegistrationEmail per poterla utilizzare in altri file dell'applicazione.

//Questo modulo è responsabile dell'invio di email di conferma di registrazione utilizzando nodemailer.
//In sintesi, questo modulo si occupa di inviare email di conferma di registrazione a un indirizzo email specificato con un link di conferma.
//Se l'email viene inviata con successo, restituisce il risultato; in caso di errore, restituisce null e stampa l'errore in
//console. Questo modulo può essere utilizzato in altri file dell'applicazione per inviare email di conferma di registrazione.