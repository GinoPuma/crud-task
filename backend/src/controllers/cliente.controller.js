import Cliente from "../models/Cliente.js";
import axios from "axios";

export const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
};

export const crearCliente = async (req, res) => {
  const { nombre, dni, empresa, celular } = req.body;
  try {
    const nuevo = await Cliente.create({ nombre, dni, empresa, celular });
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  await Cliente.destroy({ where: { id } });
  res.sendStatus(204);
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, dni, empresa, celular } = req.body;
  try {
    await Cliente.update({ nombre, dni, empresa, celular }, { where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
      const nombreCompleto = `${response.data.nombres} ${response.data.apellidoPaterno} ${response.data.apellidoMaterno}`;
      res.json({ nombre: nombreCompleto.trim() });
    } else {
      res.status(404).json({ error: "DNI no encontrado o datos incompletos." });
    }
  } catch (error) {
    console.error("Error al consultar DNI en RENIEC:", error.message);
    if (error.response && error.response.status === 404) {
      res
        .status(404)
        .json({ error: "DNI no registrado en RENIEC o formato incorrecto." });
    } else if (error.response && error.response.status === 401) {
      res.status(401).json({ error: "Clave API de RENIEC inválida." });
    } else {
      res
        .status(500)
        .json({ error: "Error interno del servidor al consultar RENIEC." });
    }
  }
};
