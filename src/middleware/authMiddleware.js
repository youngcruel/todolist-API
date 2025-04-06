import cryptoUtils from "../utils/cryptoUtils.js"; // Importa la libreria per verificare i token JWT

const authMiddleware = (req, res, next) => {
  // Controlla se l'header "Authorization" è presente nella richiesta
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Authentication error" });
  }
  // Estrae il token dalla stringa "Bearer <TOKEN>"
  const token = authorization.split(" ")[1];

  try {
    // Verifica il token JWT per ottenere i dati dell'utente
    const decoded = cryptoUtils.verifyJwt(token);

    // Se il token non è valido, restituisce errore 401
    if (!decoded) {
      return res.status(401).json({ message: "Authentication error" });
    }

    // Associa l'ID utente estratto dal token alla richiesta (req.userId)
    // Questo permette ai controller di sapere quale utente ha fatto la richiesta
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication error: error.message" });
  }
};

export default authMiddleware;
// Questo middleware viene utilizzato per proteggere le rotte che richiedono
// autenticazione. Prima di eseguire il controller associato alla rotta,
// verifica se l'utente è autenticato controllando il token JWT presente
// nell'header "Authorization". Se il token è valido, estrae l'ID utente
// e lo associa alla richiesta, altrimenti restituisce un errore 401.
