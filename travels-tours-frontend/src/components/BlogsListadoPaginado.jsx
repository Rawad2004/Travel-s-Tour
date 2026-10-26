import { useState, useEffect, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import FiltrosBlog from "./FiltrosBlog.jsx";
import TarjetaBlog from "./TarjetaBlog.jsx";
import Paginador from "./Paginador.jsx";
import { filtrarBlogs, paginarBlogs } from "../utils/blogsLista.js";

export default function BlogsListadoPaginado({
  blogs,
  modo = "publico",
  mostrarFiltroEstado = false,
  user,
  puedeBorrar,
  busyId,
  onEliminar,
  onAprobar,
  onRechazar,
  vacio = "No hay artículos que coincidan con la búsqueda.",
}) {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [page, setPage] = useState(0);

  const filtrados = useMemo(
    () =>
      filtrarBlogs(blogs, {
        nombre: filtroNombre,
        estado: mostrarFiltroEstado ? filtroEstado : "",
      }),
    [blogs, filtroNombre, filtroEstado, mostrarFiltroEstado]
  );

  const { items, totalPages, totalElements, page: currentPage } = useMemo(
    () => paginarBlogs(filtrados, page),
    [filtrados, page]
  );

  useEffect(() => {
    setPage(0);
  }, [filtroNombre, filtroEstado]);

  return (
    <>
      <FiltrosBlog
        nombre={filtroNombre}
        estado={filtroEstado}
        onNombreChange={setFiltroNombre}
        onEstadoChange={setFiltroEstado}
        mostrarEstado={mostrarFiltroEstado}
      />
      {filtrados.length === 0 ? (
        <p className="text-muted">{vacio}</p>
      ) : (
        <>
          <p className="text-muted small mb-3">
            {totalElements} artículo{totalElements !== 1 ? "s" : ""} · Página{" "}
            {currentPage + 1} de {totalPages}
          </p>
          <Row xs={1} sm={2} lg={3} className="g-4 blog-list">
            {items.map((blog) => (
              <Col key={blog.id} className="d-flex">
                <TarjetaBlog
                  blog={blog}
                  modo={modo}
                  user={user}
                  puedeBorrar={puedeBorrar}
                  busyId={busyId}
                  onEliminar={onEliminar}
                  onAprobar={onAprobar}
                  onRechazar={onRechazar}
                />
              </Col>
            ))}
          </Row>
          <Paginador
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
