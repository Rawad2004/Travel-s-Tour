import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import {
  blogSePuedeEditar,
  blogAdminPuedeModerar,
} from "../services/blogService.js";

function badgeEstadoBlog(status) {
  const s = String(status ?? "").toUpperCase();
  if (s === "APPROVED") return <Badge bg="success">Aprobado</Badge>;
  if (s === "PENDING") return <Badge bg="warning" text="dark">Pendiente</Badge>;
  if (s === "REJECTED") return <Badge bg="danger">Rechazado</Badge>;
  return <Badge bg="secondary">{s || "—"}</Badge>;
}

export function resumenBlog(blog, max = 120) {
  const texto = blog.content ?? "";
  if (texto.length <= max) return texto;
  return `${texto.slice(0, max)}…`;
}

export default function TarjetaBlog({
  blog,
  modo = "publico",
  user,
  puedeBorrar,
  busyId,
  onEliminar,
  onAprobar,
  onRechazar,
}) {
  const pendiente = String(blog.status ?? "").toUpperCase() === "PENDING";
  const mostrarModeracion =
    modo === "gestion" && pendiente && blogAdminPuedeModerar(user);

  return (
    <Card className="h-100 shadow-sm w-100">
      {blog.featuredImage ? (
        <Card.Img
          variant="top"
          src={blog.featuredImage}
          alt={blog.title}
          style={{ height: 160, objectFit: "cover" }}
        />
      ) : null}
      <Card.Body className="d-flex flex-column">
        <div
          className={`d-flex justify-content-between gap-2 mb-2 ${
            modo === "gestion" ? "align-items-start" : ""
          }`}
        >
          <Card.Title className="fs-6 mb-0">{blog.title}</Card.Title>
          {modo === "gestion" ? badgeEstadoBlog(blog.status) : null}
        </div>
        {modo === "gestion" && blog.author?.name ? (
          <Card.Text className="small text-muted mb-2">
            {blog.author.name}
          </Card.Text>
        ) : null}
        <Card.Text className="small text-muted flex-grow-1">
          {resumenBlog(blog, modo === "gestion" ? 80 : 120)}
        </Card.Text>
        {modo === "publico" ? (
          <Link to={`/blog/${blog.id}`} className="mt-2">
            Leer más
          </Link>
        ) : (
          <div className="d-flex flex-wrap gap-2 mt-auto">
            <Button
              as={Link}
              to={`/blog/${blog.id}`}
              variant="secondary"
              size="sm"
            >
              Ver detalle
            </Button>
            {blogSePuedeEditar(blog, user) ? (
              <Button
                as={Link}
                to={`/blog/${blog.id}/editar`}
                variant="outline-primary"
                size="sm"
              >
                Editar
              </Button>
            ) : null}
            {mostrarModeracion ? (
              <>
                <Button
                  variant="success"
                  size="sm"
                  disabled={busyId === blog.id}
                  onClick={() => onAprobar?.(blog.id)}
                >
                  Aprobar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  disabled={busyId === blog.id}
                  onClick={() => onRechazar?.(blog.id, blog.title)}
                >
                  Rechazar
                </Button>
              </>
            ) : null}
            {puedeBorrar?.(blog) ? (
              <Button
                variant="danger"
                size="sm"
                disabled={busyId === blog.id}
                onClick={() => onEliminar?.(blog.id, blog.title)}
              >
                {busyId === blog.id ? "…" : "Borrar"}
              </Button>
            ) : null}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
