/*import config from "./config/config.js";
import express from "express";
import connectDB from "./src/gateway/db.js";
import setup from "./src/routes/activityRoutes.js";

const app = express();
app.use(express.json());

try {
  await connectDB(); // Connessione al DB Atlas

  setup(app);

  app.listen(config.port, config.host, () => {
    console.log(`Server partito su http://${config.host}:${config.port}`);
  });
} catch (err) {
  console.error("Server not started:", err.message);
  process.exit(1);
}
export default app;*/

import config from "./config/config.js";
import express from "express";
import connectDB from "./src/gateway/db.js";
import setup from "./src/routes/activityRoutes.js";

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB(); // Connessione al DB (Atlas o Memory)

    setup(app);

    app.listen(config.port, config.host, () => {
      console.log(`🚀 Server partito su http://${config.host}:${config.port}`);
    });
  } catch (err) {
    console.error("❌ Server not started:", err.message);
    process.exit(1);
  }
};

startServer(); // chiamata esplicita

export default app;