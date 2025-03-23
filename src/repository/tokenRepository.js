import MongoInternalException from '../exceptions/MongoInternalException.js';
import tokenSchema from '../schema/registrationTokenSchema.js'; 

const add = async (userId, token) => { 
    const result = tokenSchema
    .findOneAndUpdate( 
        {userId: userId},               
        {registrationToken: token},     
        {upsert: true})
    .catch((err) => {                  
        throw err;
    });
    return result;
}

const get = async (token) => {
    const result = tokenSchema.findOne({registrationToken: token}).catch((err) => {
        throw new MongoInternalException("Errore durante la ricerca del token", "tokenRepository.get")
    })
    return result;
}

export default {add, get}; 