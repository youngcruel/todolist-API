// Questo modulo definisce una classe CryptoUtils che fornisce metodi per generare codici univoci e hash delle password.
// La classe utilizza il modulo crypto-random-string per generare codici casuali e il modulo crypto per creare hash SHA256.
// I metodi della classe possono essere utilizzati per generare codici univoci e hash delle password in un'applicazione Node.js.

import cryptoRandomString from "crypto-random-string"; // Importa il modulo crypto-random-string per generare codici casuali
import crypto from "crypto"; // Importa il modulo crypto per la crittografia nativo di Node.js
import config from '../../config/config.js';    // Importa la configurazione del server e del database da config.js
import jwt from 'jsonwebtoken';   //Importa la libreria necessaria per usare i json web token 
import dotenv from 'dotenv';
dotenv.config();

class CryptoUtils { // Definizione della classe CryptoUtils che incapsula i metodi per la crittografia
    // Genera un codice univoco con una lunghezza specificata
    generateUniqueCode(length, type = 'base64') {              
        return cryptoRandomString({ length, type});  // Genera un codice univoco di una lunghezza specificata e di un tipo specificato (il tipo predefinito è 'base64') utilizzando la libreria cryptoRandomString.
    }

    // Genera un hash della password con un salt casuale
    hashPassword(password) {
        const salt = this.generateUniqueCode(10); // Chiamata al metodo generateUniqueCode per generare un salt casuale di 10 caratteri
        return {
            password: this.sha256(password, salt), // Hash della password con SHA256 e salt
            salt: salt
        } // Restituisce un oggetto contenente la password e il salt
    }

    // Crea un hash SHA256 dei dati forniti con un salt specificato
    sha256(data, salt) {
        return crypto.createHmac('sha256', salt).update(data).digest('hex'); // Crea un hash SHA256 dei dati forniti utilizzando il salt specificato
    } // Utilizza il modulo crypto per creare un hash SHA256 dei dati forniti con un salt specificato

    comparePassword(password, user) {
    return this.sha256(password, user.salt) === user.password;
    }

    generateTokens(user){
        return {
            accessToken: this.generateToken(user, config.accessTokenExpiration), //Acces token iniziale (più facile che venga intercettato, quindi con expiration breve)
            refreshToken: this.generateToken(user, config.refreshTokenExpiration) //Refresh token (serve per velocizzare il login e non richiedere costantemente accesso, ha expiration lunga)
        }
    }

    generateToken(user, expiration){
        return jwt.sign({sub: user._id, email: user.email}, process.env.JWT_PRIVATE_KEY, {expiresIn: expiration, algorithm: 'RS256'});

    }

    verifyJWT(token) {
        const decoded = jwt.decode(token, process.env.JWT_PUBLIC_KEY, {algorithms:['RS256'], ignoreExpiration: false})
    }
}

export default new CryptoUtils(); // Esporta un'istanza della classe CryptoUtils per utilizzarla altrove nell'applicazione

// In sintesi, la classe CryptoUtils fornisce metodi per generare codici univoci e hash delle password in un'applicazione Node.js.
// Utilizza il modulo crypto-random-string per generare codici casuali e il modulo crypto per creare hash SHA256.
// I metodi della classe possono essere utilizzati per generare codici univoci e hash delle password in un'applicazione Node.js.