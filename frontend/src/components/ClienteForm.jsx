import { useState, useEffect } from "react";
import axios from "axios";

export default function ClienteForm({ onSubmit, currentClient, onCancelEdit }) {
  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    empresa: "",
    celular: "",
  });
  const [loadingDni, setLoadingDni] = useState(false);

  useEffect(() => {
    if (currentClient) {
      setForm(currentClient);
    } else {
      setForm({
        dni: "",
        nombre: "",
        empresa: "",
        celular: "",
      });
    }
  }, [currentClient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDniBlur = async (e) => {
    const dni = e.target.value.trim();
    if (dni.length === 8 && !isNaN(dni) && !currentClient) {
      setLoadingDni(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/clientes/dni/${dni}`
        );
        if (res.data.nombre) {
          setForm((prevForm) => ({ ...prevForm, nombre: res.data.nombre }));
        }
      } catch (error) {
        console.error(
          "Error al buscar DNI:",
          error.response?.data?.error || error.message
        );
        alert(
          error.response?.data?.error ||
            "No se pudo obtener el nombre para el DNI."
        );
        setForm((prevForm) => ({ ...prevForm, nombre: "" }));
      } finally {
        setLoadingDni(false);
      }
    } else if (dni.length !== 8 && !currentClient) {
      setForm((prevForm) => ({ ...prevForm, nombre: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        name="dni"
        value={form.dni}
        onChange={handleChange}
        onBlur={handleDniBlur}
        placeholder="DNI"
        required
        disabled={loadingDni || currentClient}
      />
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        required
        disabled={loadingDni}
      />
      <input
        name="empresa"
        value={form.empresa}
        onChange={handleChange}
        placeholder="Empresa"
        disabled={loadingDni}
      />
      <input
        name="celular"
        value={form.celular}
        onChange={handleChange}
        placeholder="Celular"
        disabled={loadingDni}
      />
      <button type="submit" disabled={loadingDni}>
        {currentClient ? "Actualizar" : "Guardar"}
      </button>
      {currentClient && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancelar Edición
        </button>
      )}
      {loadingDni && <p>Buscando nombre...</p>}
    </form>
  );
}
