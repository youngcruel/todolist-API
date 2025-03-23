// Questo codice definisce uno schema Mongoose per un token di registrazione in un'applicazione Node.js

import mongoose from "mongoose"; // Importo il modulo Mongoose per interagire con il database MongoDB.

const tokenSchema = new mongoose.Schema(  // Definisco uno schema Mongoose per il token di registrazione.
  {
    userId: String, // ID dell'utente associato al token
    registrationToken: String // Token di registrazione generato casualmente
  },
  {
    timestamps: {  //Viene abilitata l'opzione timestamps, che aggiunge automaticamente i campi created_at e updated_at ai documenti.
      createdAt: "created_at", // Il campo created_at viene utilizzato per tenere traccia della data di creazione del documento.
      updatedAt: "updated_at",
      writeConcern: { // Viene specificato il livello di scrittura e il timeout di scrittura per garantire che le operazioni di scrittura siano confermate.
        w: 1, // Il livello di scrittura è impostato su 1 per garantire che le operazioni di scrittura siano confermate.
        wtimeout: 2000,  // Il timeout di scrittura è impostato su 2000 millisecondi per evitare che le operazioni di scrittura richiedano troppo tempo.
      },
    },
  }

);

// Imposta una scadenza automatica del token dopo 1 ora (3600 secondi)
tokenSchema.index({ "updated_at": 1 }, { expireAfterSeconds: 3600 });
// Questo significa che i documenti in questa collezione verranno automaticamente eliminati dopo 1 ora dalla loro creazione.

export default mongoose.model("RegistrationToken", tokenSchema); // Esporto il modello Mongoose RegistrationToken associato allo schema tokenSchema.

// In sintesi, questo codice definisce uno schema per i token di registrazione, 
// aggiunge automaticamente i timestamp ai documenti e imposta una scadenza automatica di 1 ora per i documenti.