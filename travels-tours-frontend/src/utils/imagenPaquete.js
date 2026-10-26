export function imagenPaquete(paquete) {
  const pkg = paquete?.travelPackage ?? paquete;
  const img =
    pkg?.images ??
    pkg?.image ??
    pkg?.featuredImage ??
    pkg?.thumbnail ??
    "";

  if (!img) return "https://placehold.co/600x400?text=Viaje";
  if (Array.isArray(img)) return img[0] || "https://placehold.co/600x400?text=Viaje";
  if (typeof img === "string" && img.includes(",")) return img.split(",")[0].trim();
  return img;
}
