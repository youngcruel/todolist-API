import userService from "../services/UserService.js";

const register = async (req, res) => {
  const data = req.body;

  try {
    const user = await userService.register(data);

    res.status(201).json({
      message:
        "Registrazione riuscita! Controlla la tua email per confermare l'account.",
    });
  } catch (error) {
    res.status(error.status).json({ code: error.code, message: error.message });
  }
};

export default register;
