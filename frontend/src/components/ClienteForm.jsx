import { useState, useEffect } from "react";
import axios from "axios";

export default function ClienteForm({ onSubmit, currentClient, onCancelEdit }) {
  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    empresa: "",
    celular: "",
  });
  const [formErrors, setFormErrors] = useState({});
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
    setFormErrors({}); 
  }, [currentClient]);

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio.";
    } else if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI solo debe contener números.";
    } else if (formData.dni.length !== 8) {
      newErrors.dni = "El DNI debe tener 8 dígitos.";
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El Nombre es obligatorio.";
    }

    if (formData.celular.trim()) {
      if (!/^\d+$/.test(formData.celular)) {
        newErrors.celular = "El Celular solo debe contener números.";
      } else if (formData.celular.length !== 9) {
        newErrors.celular = "El Celular debe tener 9 dígitos.";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (formErrors[name]) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleDniBlur = async (e) => {
    const dniValue = e.target.value.trim();
    const currentErrors = validateForm({
      dni: dniValue,
      nombre: form.nombre,
      celular: form.celular,
    });

    if (currentErrors.dni) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        dni: currentErrors.dni,
      }));
      return;
    } else {
      if (formErrors.dni) {
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.dni;
          return updatedErrors;
        });
      }
    }

    if (dniValue.length === 8 && !currentClient) {
      setLoadingDni(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/clientes/dni/${dniValue}`
        );
        if (res.data.nombre) {
          setForm((prevForm) => ({ ...prevForm, nombre: res.data.nombre }));
          if (formErrors.nombre) {
            setFormErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors.nombre;
              return updatedErrors;
            });
          }
        }
      } catch (error) {
        setForm((prevForm) => ({ ...prevForm, nombre: "" }));
        const errorMessage =
          error.response?.data?.error ||
          "No se pudo obtener el nombre para el DNI.";
        setFormErrors((prevErrors) => ({ ...prevErrors, dni: errorMessage }));
        console.error("Error al buscar DNI:", errorMessage, error);
      } finally {
        setLoadingDni(false);
      }
    } else if (dniValue.length !== 8 && !currentClient) {
      setForm((prevForm) => ({ ...prevForm, nombre: "" }));
    }
  };

  const handleCelularBlur = (e) => {
    const celularValue = e.target.value.trim();
    const currentErrors = validateForm({
      dni: form.dni,
      nombre: form.nombre,
      celular: celularValue,
    });

    if (currentErrors.celular) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        celular: currentErrors.celular,
      }));
    } else if (formErrors.celular) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.celular;
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResults = validateForm(form);
    setFormErrors(validationResults);

    if (Object.keys(validationResults).length > 0) {
      return; 
    }

    const response = await onSubmit(form);

    if (response && response.fieldErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ...response.fieldErrors,
      }));
    } else {
      if (!currentClient) {
        setForm({
          dni: "",
          nombre: "",
          empresa: "",
          celular: "",
        });
        setFormErrors({}); 
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <input
          name="dni"
          value={form.dni}
          onChange={handleChange}
          onBlur={handleDniBlur}
          placeholder="DNI"
          required
          disabled={loadingDni || !!currentClient}
          style={{ borderColor: formErrors.dni ? "red" : "" }}
        />
        {formErrors.dni && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.2rem" }}>
            {formErrors.dni}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          disabled={loadingDni}
          style={{ borderColor: formErrors.nombre ? "red" : "" }}
        />
        {formErrors.nombre && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.2rem" }}>
            {formErrors.nombre}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          placeholder="Empresa"
          disabled={loadingDni}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          name="celular"
          value={form.celular}
          onChange={handleChange}
          onBlur={handleCelularBlur}
          placeholder="Celular"
          disabled={loadingDni}
          style={{ borderColor: formErrors.celular ? "red" : "" }}
        />
        {formErrors.celular && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.2rem" }}>
            {formErrors.celular}
          </p>
        )}
      </div>

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
      {loadingDni && <p style={{ marginTop: "1rem" }}>Buscando nombre...</p>}
    </form>
  );
}
