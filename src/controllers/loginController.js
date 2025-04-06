import userService from "../services/UserService.js";
import UserNormalizer from "../normalizer/UserNormalizer.js";

const login = async (req, res) => {
  const data = req.body;

  try {
    const user = await userService.login(data);
    return res.status(200).json(new UserNormalizer(user).getLogin());
  } catch (error) {
    // Se l'errore è una UnauthorizedException, restituisci un 401
    if (error instanceof UnauthorizedException) {
      return res.status(401).json({ message: error.message });
    }

    // Gestione di errori imprevisti, come problemi con il server
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export default login;
