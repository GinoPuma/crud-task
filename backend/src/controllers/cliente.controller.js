import Cliente from "../models/Cliente.js";
import axios from "axios";
import { UniqueConstraintError } from "sequelize"; 

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    res.status(500).json({ error: "Error al obtener clientes." });
  }
};

export const crearCliente = async (req, res) => {
  const { nombre, dni, empresa, celular } = req.body;
  try {
    const nuevo = await Cliente.create({ nombre, dni, empresa, celular });
    res.status(201).json(nuevo); // Usar 201 Created para recursos nuevos
  } catch (err) {
    console.error("Error al crear cliente:", err);
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({
        error:
          "El DNI ingresado ya existe para otro cliente. Por favor, utilice un DNI diferente.",
        field: "dni", 
      });
    }
    res
      .status(400)
      .json({ error: err.message || "Error al crear el cliente." });
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Cliente.destroy({ where: { id } });
    if (result === 0) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al eliminar cliente:", err);
    res.status(500).json({ error: "Error al eliminar el cliente." });
  }
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, dni, empresa, celular } = req.body;
  try {
    const [updatedRows] = await Cliente.update(
      { nombre, dni, empresa, celular },
      { where: { id } }
    );
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "Cliente no encontrado para actualizar." });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({
        error:
          "El DNI ingresado ya existe para otro cliente. Por favor, utilice un DNI diferente.",
        field: "dni",
      });
    }
    res
      .status(400)
      .json({ error: err.message || "Error al actualizar el cliente." });
  }
};

export const buscarDniReniec = async (req, res) => {
  const { dni } = req.params;
  const RUC_DNI_API_KEY = process.env.RENIEC_API_KEY;

  if (!RUC_DNI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Clave API de RENIEC no configurada en el servidor." });
  }

  if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
    return res
      .status(400)
      .json({
        error: "Formato de DNI inválido. Debe ser 8 dígitos numéricos.",
      });
  }

  try {
    const response = await axios.get(
      `https://api.apis.net.pe/v1/dni?numero=${dni}`,
      {
        headers: {
          Authorization: `Bearer ${RUC_DNI_API_KEY}`,
        },
      }
    );

    if (response.data && response.data.nombres) {
      const nombreCompleto = `${response.data.nombres || ""} ${
        response.data.apellidoPaterno || ""
      } ${response.data.apellidoMaterno || ""}`;
      res.json({ nombre: nombreCompleto.trim() });
    } else {
      res
        .status(404)
        .json({
          error:
            "DNI no encontrado o datos incompletos en la respuesta de la API.",
        });
    }
  } catch (error) {
    console.error("Error al consultar DNI en RENIEC:", error.message);
    if (error.response && error.response.status === 404) {
      res
        .status(404)
        .json({
          error:
            "El DNI no está registrado o el formato es incorrecto para la búsqueda RENIEC.",
        });
    } else if (error.response && error.response.status === 401) {
      res
        .status(401)
        .json({
          error: "Autorización de API RENIEC inválida. Verifique su clave.",
        });
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      res
        .status(error.response.status || 500)
        .json({
          error: `Error de la API RENIEC: ${error.response.data.message}`,
        });
    } else {
      res
        .status(500)
        .json({ error: "Error interno del servidor al consultar RENIEC." });
    }
  }
};
