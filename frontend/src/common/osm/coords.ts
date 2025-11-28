import axios from "axios";

export async function getCoordRoutes(start: [number, number], end: [number, number]) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  // [lat, lng]
  const res = await axios.get(url);
  const data = res.data;
  const coords = data.routes[0].geometry.coordinates as [number, number][];

  return coords.map(([lng, lat]) => [lat, lng] as [number, number]);
}


