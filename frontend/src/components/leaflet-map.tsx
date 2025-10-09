import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import React, { useEffect } from "react";
import L, { type LeafletMouseEvent, type Icon } from "leaflet";
import Swal from "sweetalert2";
import { getLocationInfo } from "../utils/getLocationInfo";
import { PointTypeValue } from "../common/values";
import type { RouteDetailsFormatType } from "../common/types";

interface LeafletMapProps {
  height?: number | string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  handlePickupSelected?: (lat: number, lng: number, info: any) => void;
  enableSearch?: boolean;
  enableBaseLayers?: boolean;
  lat?: number;
  lng?: number;
  type?: "select" | "detail";
  pointType?: string;
  routeDetails?: RouteDetailsFormatType[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  height = 400,
  defaultCenter = [10.762622, 106.660172],
  defaultZoom = 13,
  handlePickupSelected,
  enableSearch = true,
  enableBaseLayers = true,
  lat,
  lng,
  type = "select",
  pointType,
  routeDetails,
}) => {
  useEffect(() => {
    // 🗺️ Các bản đồ nền
    const light = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "&copy; CARTO" }
    );
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }
    );
    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google Satellite",
      }
    );
    const dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "&copy; CARTO" }
    );

    // Khởi tạo bản đồ
    const map = L.map("leaflet-map", {
      center: lat && lng ? [lat, lng] : defaultCenter,
      zoom: defaultZoom,
      layers: [street],
    });

    // Bộ chọn lớp nền
    if (enableBaseLayers) {
      const baseMaps = {
        "Bản đồ trắng": light,
        "Bản đồ đường": street,
        "Bản đồ vệ tinh": satellite,
        "Bản đồ tối": dark,
      };
      L.control.layers(baseMaps).addTo(map);
    }

    // Thanh tìm kiếm
    if (enableSearch) {
      (L.Control as any)
        .geocoder({ defaultMarkGeocode: false })
        .on("markgeocode", (e: any) => {
          const latlng = e.geocode.center;
          map.setView(latlng, 15);
          L.marker(latlng)
            .addTo(map)
            .bindPopup(`<b>${e.geocode.name}</b>`)
            .openPopup();
        })
        .addTo(map);
    }

    // 🧭 Chọn icon theo loại điểm
    const getIconByType = (pointType?: string): Icon => {
      if (pointType === PointTypeValue.school) {
        return L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
      }
      if (pointType === PointTypeValue.pickup) {
        return L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/6395/6395324.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
      }
      if (pointType === PointTypeValue.bus) {
        return L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/1068/1068580.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
      }
      // Icon mặc định
      return L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
    };

    // 🔘 Nếu có sẵn toạ độ, đánh dấu điểm
    let marker: L.Marker | null = null;
    if (lat && lng) {
      marker = L.marker([lat, lng], { icon: getIconByType(pointType) })
        .addTo(map)
        .bindPopup(
          `<b>${pointType || "Tọa độ"}</b><br>${lat.toFixed(6)}, ${lng.toFixed(
            6
          )}`
        )
        .openPopup();
    }

    // 🔹 Nếu có routeDetails, hiển thị tất cả điểm và đường nối
    // if (routeDetails && routeDetails.length > 0) {
    //   const sortedRoute = [...routeDetails].sort((a, b) => a.order! - b.order!);
    //   const latlngs: [number, number][] = [];

    //   sortedRoute.forEach((item) => {
    //     const { lat, lng, category, name } = item.pickup!;
    //     latlngs.push([lat!, lng!]);

    //     L.marker([lat!, lng!], { icon: getIconByType(category) })
    //       .addTo(map)
    //       .bindPopup(
    //         `<b style="font-size: 0.9rem;font-weight: 500;">${name}</b><br>- Loại trạm: ${category}<br>- Toạ độ x:${lat}<br>- Toạ độ y:${lng}`
    //       );
    //   });

    //   // Vẽ polyline nối các điểm
    //   L.polyline(latlngs, {
    //     color: "blue",
    //     weight: 4,
    //     opacity: 0.6,
    //     lineJoin: "round",
    //   }).addTo(map);

    //   // Zoom map vừa tất cả các điểm
    //   const bounds = L.latLngBounds(latlngs);
    //   map.fitBounds(bounds, { padding: [50, 50] });
    // }
    // 🔹 Nếu có routeDetails, hiển thị tất cả điểm và đường đi thực tế
    if (routeDetails && routeDetails.length > 0) {
      const sortedRoute = [...routeDetails].sort((a, b) => a.order! - b.order!);

      // Lấy danh sách coordinates cho API ORS [lng, lat]
      const coordinates: [number, number][] = sortedRoute.map((item) => [
        item.pickup!.lng!,
        item.pickup!.lat!,
      ]);

      // Marker cho từng điểm
      sortedRoute.forEach((item) => {
        const { lat, lng, category, name } = item.pickup!;
        L.marker([lat!, lng!], { icon: getIconByType(category) })
          .addTo(map)
          .bindPopup(
            `<b style="font-size: 0.9rem;font-weight: 500;">${name}</b><br>- Loại trạm: ${category}<br>- Toạ độ x:${lat}<br>- Toạ độ y:${lng}`
          );
      });

      // Gọi API ORS để lấy đường đi
      fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization:
              "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAzNTQ5M2E2YWEwMjQwZWQ5Njc3NGQ1OGMzNDgyMzJlIiwiaCI6Im11cm11cjY0In0=",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coordinates }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // Vẽ đường đi thực tế
          L.geoJSON(data, {
            style: { color: "blue", weight: 4, opacity: 0.6 },
          }).addTo(map);

          // Zoom map vừa tất cả các điểm
          const latlngs = sortedRoute.map(
            (item) => [item.pickup!.lat!, item.pickup!.lng!] as L.LatLngTuple
          );
          const bounds = L.latLngBounds(latlngs);
          map.fitBounds(bounds, { padding: [50, 50] });
        })
        .catch((err) => console.error(err));
    }

    // 🎯 Nếu là chế độ "select", cho phép chọn điểm
    if (type === "select" && handlePickupSelected) {
      map.on("click", async (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Xoá marker cũ
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng], { icon: getIconByType(pointType) }).addTo(
          map
        );

        marker
          .bindPopup(
            `<b>${pointType || "Tọa độ"}</b><br>${lat.toFixed(
              6
            )}, ${lng.toFixed(6)}`
          )
          .openPopup();

        Swal.fire({
          icon: "success",
          title: "📍 Điểm đã chọn",
          html: `<b>${pointType || "Tọa độ"}:</b> ${lat.toFixed(
            6
          )}, ${lng.toFixed(6)}`,
          confirmButtonColor: "#0078ff",
        });

        const info = await getLocationInfo(lat, lng);
        handlePickupSelected(lat, lng, info);
      });
    }

    // Nếu là chế độ "detail", chỉ xem
    if (type === "detail") {
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }

    return () => {
      map.remove();
    };
  }, [
    defaultCenter,
    defaultZoom,
    enableSearch,
    enableBaseLayers,
    handlePickupSelected,
    lat,
    lng,
    type,
    pointType,
    routeDetails,
  ]);

  return (
    <div
      id="leaflet-map"
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        borderRadius: "8px",
      }}
    ></div>
  );
};

export default LeafletMap;
