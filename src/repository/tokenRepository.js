import MongoInternalException from "../exceptions/MongoInternalException.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import tokenSchema from "../schema/registrationTokenSchema.js";

class TokenRepository {
  async add(userId, token) {
    const result = await tokenSchema
      .findOneAndUpdate(
        { userId: userId },
        { registrationToken: token },
        { upsert: true, new: true }
      )
      .catch(() => {
        throw new MongoInternalException(
          "Errore durante l'aggiunta del token",
          "TokenRepository.add"
        );
      });

    return result;
  }

  async get(token) {
    const result = await tokenSchema
      .findOne({ registrationToken: token })
      .catch(() => {
        throw new MongoInternalException(
          "Errore durante la ricerca del token",
          "TokenRepository.get"
        );
      });

    if (!result) {
      throw new NotFoundException("Token non trovato", "tokenRepository.get");
    }

    return result;
  }
}

export default new TokenRepository();
