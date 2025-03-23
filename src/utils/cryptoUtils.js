import cryptoRandomString from "crypto-random-string"; 
import crypto from "crypto"; 
import config from '../../config/config.js';   
import jwt from 'jsonwebtoken';   
import dotenv from 'dotenv';
dotenv.config();

class CryptoUtils { 
    // Genera un codice univoco con una lunghezza specificata
    generateUniqueCode(length, type = 'base64') {              
        return cryptoRandomString({ length, type});  
    }

    // Genera un hash della password con un salt casuale
    hashPassword(password) {
        const salt = this.generateUniqueCode(10); 
        return {
            password: this.sha256(password, salt), 
            salt: salt
        } 
    }

    // Crea un hash SHA256 dei dati forniti con un salt specificato
    sha256(data, salt) {
        return crypto.createHmac('sha256', salt).update(data).digest('hex'); 
    } 

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
        return decoded;
    }
}

export default new CryptoUtils(); 