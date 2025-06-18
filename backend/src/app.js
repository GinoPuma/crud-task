import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./database.js";
import clienteRoutes from "./routes/cliente.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clienteRoutes);

db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
});
