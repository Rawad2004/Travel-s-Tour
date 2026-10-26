import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {
  agregarFavorito,
  quitarFavorito,
  esFavorito,
} from "../services/favoritosService.js";
import { TOKEN_KEY } from "../services/api.js";
import { imagenPaquete } from "../utils/imagenPaquete.js";

export default function TarjetaPaquete({ paquete, favoritoInicial }) {
  const [fav, setFav] = useState(!!favoritoInicial);
  const [favBusy, setFavBusy] = useState(false);
  const logueado = !!localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    if (favoritoInicial !== undefined) return;
    const pkgId = (paquete?.travelPackage ?? paquete)?.id ?? paquete?.id;
    if (!logueado || !pkgId) return;
    esFavorito(pkgId)
      .then((ok) => setFav(!!ok))
      .catch(() => {});
  }, [paquete?.id, favoritoInicial, logueado]);

  async function toggleFav(e) {
    e.preventDefault();
    if (!logueado) return;
    setFavBusy(true);
    try {
      const pkgId = (paquete?.travelPackage ?? paquete)?.id ?? paquete?.id;
      if (fav) {
        await quitarFavorito(pkgId);
        setFav(false);
      } else {
        await agregarFavorito(pkgId);
        setFav(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFavBusy(false);
    }
  }

  const pkg = paquete?.travelPackage ?? paquete;
  const id = pkg?.id ?? paquete?.id;
  const nombre = pkg?.name ?? paquete?.name ?? "Paquete";
  const destino = pkg?.destination ?? paquete?.destination ?? "";
  const precio = pkg?.price ?? paquete?.price;

  return (
    <Card className="h-100 shadow-sm tarjeta-paquete w-100">
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={imagenPaquete(pkg)}
          alt={nombre}
          style={{ height: 180, objectFit: "cover" }}
        />
        {logueado ? (
          <button
            type="button"
            className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
            onClick={toggleFav}
            disabled={favBusy}
            aria-label="favorito"
          >
            {fav ? "♥" : "♡"}
          </button>
        ) : null}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{nombre}</Card.Title>
        <Card.Text className="text-muted small mb-2">{destino}</Card.Text>
        <Card.Text className="fw-bold mt-auto">
          ${Number(precio ?? 0).toLocaleString("es-CO")}
        </Card.Text>
        <Button
          as={Link}
          to={`/paquete/${id}`}
          variant="primary"
          size="sm"
          className="w-100"
        >
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  );
}
