// Il codice fornito è un modulo di servizio per la gestione degli utenti in un'applicazione.

import userRepository from "../repository/userRepository.js"; // Importa il repository degli utenti
import cryptoUtils from "../utils/cryptoUtils.js";           // Importa l'utilità per la crittografia (hashing delle password)
import tokenRepository from "../repository/tokenRepository.js"; // Importa il repository dei token (es. token di registrazione)
import emailGateway from "../gateway/emailGateway.js";     // Importa il gateway per l'invio di email (es. conferma di registrazione)
import NotFoundException from "../exceptions/NotFoundException.js"; //Importa l'exception
import { userStatus } from "../const/constant.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";

// Registra un nuovo utente
const register = async (data) => {  // La funzione register è asincrona e accetta un oggetto data contenente i dati dell'utente da registrare
    try {
        

        // Genera l'hash della password e un salt
        const {password, salt} = cryptoUtils.hashPassword(data.password); 
        data.password = password; // Aggiorna la password nell'oggetto data
        data.salt = salt; // Aggiorna il salt nell'oggetto data

       
        // Salva l'utente nel database
        const user = await userRepository.add(data);  // Chiama la funzione add del repository degli utenti passando i dati dell'utente per salvarlo nel database
        if (!user) { 
            throw new Error("Errore durante la creazione dell'utente"); // Se la creazione dell'utente fallisce, lancia un errore
        }

        
        // Genera un token di registrazione per la conferma via email
        const registrationToken = cryptoUtils.generateUniqueCode(10); // Genera un codice univoco di 10 caratteri per il token di registrazione
        await tokenRepository.add(user._id, registrationToken); // Salva il token di registrazione associato all'utente nel database

      
        // Invia l'email di conferma
        await emailGateway.sendRegistrationEmail(user.email, registrationToken); // Invia un'email di conferma all'utente con il token di registrazione

        console.log('-------')
        return user; // Restituisce l'utente registrato 

    } catch (error) { // Gestione degli errori
        console.error("Errore nella registrazione:", error.message);
        return null; // Il controller ora saprà che c'è stato un errore
    }
};

const activate = async (token) => {

        //Cerca il token
        const tokenData = await tokenRepository.get(token);

        if (!tokenData) {
            throw new NotFoundException("Token non trovato", "userService.activate");
        }
        //Attiva l'utente
        const user = await userRepository.activate(tokenData.userId);

        if(!user){
            throw new NotFoundException("Attivazione fallita", "userService.activate");
        }
        console.log("Utente attivato:", user);
        return user;
};

const login = async (email, password) => {
    const user = await userRepository.getByEmail(email);
    console.log(user)
    if (!user || user.status !== userStatus.ACTIVE || !cryptoUtils.comparePassword(password, user)) {
        throw new UnauthorizedException("Non autorizzato", "userService.login");
    }
    const {accessToken, refreshToken} = cryptoUtils.generateTokens(user);
    return {user, accessToken, refreshToken}
}

export default {register, activate, login}; // Esporta la funzione register per poterla utilizzare altrove nell'applicazione

// In sintesi, questa funzione gestisce l'intero processo di registrazione di un nuovo utente, 
// inclusi l'hashing della password, il salvataggio nel database, la generazione di un token di conferma e l'invio di un'email di conferma.
