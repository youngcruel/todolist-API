import userSchema from "../schema/userSchema.js";
import { userStatus } from "../const/constant.js";
import MongoInternalException from "../exceptions/MongoInternalException.js";
import User from "../models/User.js";
import NotCreatedException from "../exceptions/NotCreatedException.js";

class UserRepository {
  async add(data) {
    const user = await userSchema
      .findOneAndUpdate(
        { email: data.email, status: { $ne: userStatus.ACTIVE } },
        data,
        { new: true, upsert: true }
      )
      .catch(() => {
        throw new MongoInternalException(
          "Errore durante la creazione dell'utente",
          "UserRepository.add"
        );
      });

    if (!user) {
      throw new NotCreatedException(
        "Errore durante la creazione dell'utente",
        "UserRepository.add"
      );
    }

    return new User(user);
  }

  async activate(id) {
    const user = await userSchema
      .findOneAndUpdate(
        { _id: id, status: userStatus.PENDING },
        { status: userStatus.ACTIVE },
        { new: true, upsert: false }
      )
      .catch((error) => {
        throw new MongoInternalException(
          "Errore durante l'attivazione dell'utente",
          "UserRepository.activate"
        );
      });

    if (!user) {
      throw new NotCreatedException(
        "Errore durante l'attivazione dell'utente",
        "UserRepository.activate"
      );
    }

    return new User(user);
  }

  async getByEmail(email) {
    return await userSchema.findOne({ email }).catch(() => {
      throw new MongoInternalException(
        "Mongo internal error",
        "UserRepository.getByEmail"
      );
    });
  }
}

export default new UserRepository();
