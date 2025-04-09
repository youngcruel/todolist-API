import config from "../../config/config.js";
import userRepository from "../repository/UserRepository.js";
import cryptoUtils from "../utils/cryptoUtils.js";
import tokenRepository from "../repository/TokenRepository.js";
import EmailGatewayFactory from "../gateway/EmailGatewayFactory.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";

class UserService {
  constructor() {
    this.emailGateway = EmailGatewayFactory.build(config.mailConfig.type);
  }

  // Registra un nuovo utente
  async register(data) {
    // Genera l'hash della password con un salt
    const { password, salt } = cryptoUtils.hashPassword(data.password);
    data.password = password;
    data.salt = salt;

    // Salva l'utente nel database
    const user = await userRepository.add(data);

    // Genera un token di registrazione per la conferma via email
    const registrationToken = cryptoUtils.generateUniqueCode(10);
    await tokenRepository.add(user.id, registrationToken);

    // Invia l'email di conferma
    await this.emailGateway.sendRegistrationEmail(
      user.email,
      registrationToken
    );

    return user;
  }

  // Attiva un nuovo utente
  async activate(token) {
    // Cerca il token
    const tokenData = await tokenRepository.get(token);
    console.log("tokenData", tokenData);
    // Attiva l'utente
    const user = await userRepository.activate(tokenData.userId);
    console.log("user", user);
    return user;
  }

  //Logga un nuovo utente
  async login(data) {
    // Cerca l'utente per email
    const user = await userRepository.getByEmail(data.email);

    if (
      !user ||
      user.status !== "active" ||
      !cryptoUtils.comparePassword(data.password, user)
    ) {
      throw new UnauthorizedException("Unathorized", "userService.login");
    }

    const { accessToken, refreshToken } = cryptoUtils.generateTokens(user);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    return user;
  }
}
export default new UserService();
