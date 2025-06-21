import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ClienteForm from "./components/ClienteForm";
import ClienteTable from "./components/ClienteTable";
import "./index.css";

const GlobalMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  const style = {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: type === "error" ? "#721c24" : "#155724",
    backgroundColor: type === "error" ? "#f8d7da" : "#d4edda",
    borderColor: type === "error" ? "#f5c6cb" : "#c3e6cb",
    border: "1px solid",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: type === "error" ? "#721c24" : "#155724",
  };

  return (
    <div style={style}>
      <span>{message}</span>
      <button onClick={onClose} style={closeButtonStyle}>
        &times;
      </button>
    </div>
  );
};

function App() {
  const [clientes, setClientes] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);
  const [globalMessage, setGlobalMessage] = useState(null);

  useEffect(() => {
    if (globalMessage) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalMessage]);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setGlobalMessage({
        type: "error",
        text: "Error al cargar los clientes.",
      });
    }
  };

  const handleFormSubmit = async (clienteData) => {
    let success = false;
    let responseToForm = null;

    try {
      if (clienteActual) {
        await axios.put(
          `http://localhost:5000/api/clientes/${clienteActual.id}`,
          clienteData
        );
        setGlobalMessage({
          type: "success",
          text: "Cliente actualizado con éxito.",
        });
        success = true;
      } else {
        // Lógica para CREAR
        await axios.post("http://localhost:5000/api/clientes", clienteData);
        setGlobalMessage({
          type: "success",
          text: "Cliente creado con éxito.",
        });
        success = true;
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error.response);
      let errorMessage = "Error al guardar el cliente.";
      let errorField = null;

      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || errorMessage;
        errorField = error.response.data.field || null;
      }

      if (
        error.response &&
        error.response.status === 409 &&
        errorField === "dni"
      ) {
        responseToForm = { fieldErrors: { dni: errorMessage } };
      } else {
        setGlobalMessage({ type: "error", text: errorMessage });
      }
    } finally {
      if (success && !responseToForm) {
        setClienteActual(null);
      }
      obtenerClientes();
    }

    return responseToForm;
  };

  const eliminarCliente = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al cliente de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/clientes/${id}`);
        setGlobalMessage({
          type: "success",
          text: "Cliente eliminado con éxito.",
        });
        obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        const errorMessage =
          error.response?.data?.error || "Error al eliminar el cliente.";
        setGlobalMessage({ type: "error", text: errorMessage });
      }
    }
  };

  const handleEdit = (cliente) => {
    setClienteActual(cliente);
    setGlobalMessage(null);
  };

  const handleCancelEdit = () => {
    setClienteActual(null);
    setGlobalMessage(null);
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CRUD de Clientes</h1>
      <GlobalMessage
        message={globalMessage?.text}
        type={globalMessage?.type}
        onClose={() => setGlobalMessage(null)}
      />
      <ClienteForm
        onSubmit={handleFormSubmit}
        currentClient={clienteActual}
        onCancelEdit={handleCancelEdit}
      />
      <ClienteTable
        clientes={clientes}
        onDelete={eliminarCliente}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;
