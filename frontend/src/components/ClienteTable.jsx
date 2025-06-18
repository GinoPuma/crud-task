export default function ClienteTable({ clientes, onDelete, onEdit }) {
  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>Nro. de Orden</th> 
          <th>Nombre</th>
          <th>DNI</th>
          <th>Empresa</th>
          <th>Celular</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map(
          (
            cli,
            index 
          ) => (
            <tr key={cli.id}>
              <td>{index + 1}</td>{" "}
              <td>{cli.nombre}</td>
              <td>{cli.dni}</td>
              <td>{cli.empresa}</td>
              <td>{cli.celular}</td>
              <td>
                <button onClick={() => onDelete(cli.id)}>Eliminar</button>
                <button
                  onClick={() => onEdit(cli)}
                  style={{ marginLeft: "5px" }}
                >
                  Editar
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
