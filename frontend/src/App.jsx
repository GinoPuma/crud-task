import axios from "axios";
import { useEffect, useState } from "react";
import ClienteForm from "./components/ClienteForm";
import ClienteTable from "./components/ClienteTable";

function App() {
  const [clientes, setClientes] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleFormSubmit = async (clienteData) => {
    try {
      if (clienteActual) {
        await axios.put(
          `http://localhost:5000/api/clientes/${clienteActual.id}`,
          clienteData
        );
      } else {
        await axios.post("http://localhost:5000/api/clientes", clienteData);
      }
      setClienteActual(null);
      obtenerClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert(error.response?.data?.error || "Error al guardar cliente.");
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleEdit = (cliente) => {
    setClienteActual(cliente);
  };

  const handleCancelEdit = () => {
    setClienteActual(null);
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CRUD de Clientes</h1>
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
