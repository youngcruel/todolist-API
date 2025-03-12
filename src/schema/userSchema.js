// Questo codice definisce uno schema Mongoose per un modello di utente in un'applicazione Node.js. 

import mongoose from "mongoose"; // Importa il modulo mongoose per la gestione del database
import { userStatus } from "../const/constant.js"; // Importa la costante userStatus da constant.js, file di costanti che definisce i possibili stati di un utente

const userSchema = new mongoose.Schema( // Definizione schema Mongoose per la collezione "User"
  {
    email: {  // Stringa che contiene Campo obbligatorio, unico, convertito in minuscolo e senza spazi iniziali o finali.
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: String, // Stringa contenente la password dell utente (non obbligatoria) 
    salt: String, // Stringa contenente il sale per la password (non obbligatoria)
    status: { // Stato dell'utente (attivo, inattivo, in sospeso)
      type: String, 
      default: userStatus.PENDING, // Stato di default: "in sospeso"

    },
  },
  {
    timestamps: { // Aggiunge automaticamente i campi created_at e updated_at per tenere traccia della creazione e dell'aggiornamento dei documenti.
      createdAt: "created_at",
      updatedAt: "updated_at",
      writeConcern: { // Specifica le opzioni di scrittura per il documento
        w: 1, // Operazione deve essere confermata da un solo nodo
        wtimeout: 2000, // Timeout di 2 secondi
      },
    },
  }
);

const user = mongoose.model("User", userSchema); // Crea il modello "User" a partire dallo schema "userSchema"

export default user; // Esporta il modello "User" per poterlo utilizzare in altri file del progetto

// In sintesi, questo file definisce uno schema per gli utenti con campi specifici e configurazioni, 
// crea un modello basato su questo schema e lo esporta per l'uso altrove nell'applicazione.
// Questo schema definisce i campi e le proprietà di un utente in un'applicazione Node.js,
// specificando i campi email, password, salt e status, con le relative configurazioni e opzioni.
// Il modello "User" creato a partire da questo schema può essere utilizzato per interagire con il database MongoDB
// e gestire le operazioni CRUD (Create, Read, Update, Delete) sugli utenti dell'applicazione.