import { Router } from "express";
import {
  crearCliente,
  eliminarCliente,
  obtenerClientes,
  actualizarCliente,
  buscarDniReniec,
} from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.delete("/:id", eliminarCliente);
router.put("/:id", actualizarCliente);
router.get("/dni/:dni", buscarDniReniec);

export default router;
