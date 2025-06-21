export default function ClienteTable({ clientes, onDelete, onEdit }) {
  return (
    <table className="cliente-table">
      <thead>
        <tr>
          <th>NRO. ORDEN</th>
          <th>NOMBRE</th>
          <th>DNI</th>
          <th>EMPRESA</th>
          <th>CELULAR</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cli, index) => (
          <tr key={cli.id}>
            <td>{index + 1}</td> <td>{cli.nombre}</td>
            <td>{cli.dni}</td>
            <td>{cli.empresa}</td>
            <td>{cli.celular}</td>
            <td>
              <button onClick={() => onDelete(cli.id)}>Eliminar</button>
              <button onClick={() => onEdit(cli)}>Editar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
