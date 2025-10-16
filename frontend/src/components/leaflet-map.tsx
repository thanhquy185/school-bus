import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import React, { useEffect, type Dispatch, type SetStateAction } from "react";
import L, { type LeafletMouseEvent, type Icon } from "leaflet";
import Swal from "sweetalert2";
import { getLocationInfo } from "../utils/getLocationInfo";
import {
  ActivePickupStatusValue,
  ActiveStatusValue,
  PointTypeValue,
} from "../common/values";
import type {
  ActivePickupFormatType,
  BusType,
  RouteDetailsFormatType,
  ScheduleFormatType,
} from "../common/types";

export type HandleSelectedPickupProps = {
  id?: number;
  name?: string;
  category?: string;
  lat?: number;
  lng?: number;
  info?: any;
};

export type HandleSelectedBusProps = {
  activePickupId?: number;
};

interface LeafletMapProps {
  height?: number | string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  enableSearch?: boolean;
  enableBaseLayers?: boolean;
  lat?: number;
  lng?: number;
  type?: "select" | "detail";
  pointType?: string;
  routeDetails?: RouteDetailsFormatType[];
  routeDetailsList?: {
    routeDetails: RouteDetailsFormatType[];
    status: string;
  }[];
  activePickups?: ActivePickupFormatType[];
  handleSelectedPickup?: ({
    id,
    name,
    category,
    lat,
    lng,
    info,
  }: HandleSelectedPickupProps) => void;
  handleSelectedBus?: ({ activePickupId }: HandleSelectedBusProps) => void;
}

const apiKey =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAzNTQ5M2E2YWEwMjQwZWQ5Njc3NGQ1OGMzNDgyMzJlIiwiaCI6Im11cm11cjY0In0=";

const LeafletMap: React.FC<LeafletMapProps> = ({
  height = 400,
  defaultCenter = [10.762622, 106.660172],
  defaultZoom = 13,
  enableSearch = true,
  enableBaseLayers = true,
  lat,
  lng,
  type = "select",
  pointType,
  routeDetails,
  routeDetailsList,
  activePickups,
  handleSelectedPickup,
  handleSelectedBus,
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
        const { id, name, category, lat, lng } = item.pickup!;
        L.marker([lat!, lng!], { icon: getIconByType(category) })
          .addTo(map)
          .bindPopup(
            `<b style="font-size: 0.9rem;font-weight: 500;">${name}</b><br>- Loại trạm: ${category}<br>- Toạ độ x:${lat}<br>- Toạ độ y:${lng}`
          )
          .addEventListener("click", async () => {
            if (handleSelectedPickup) {
              const info = await getLocationInfo(lat!, lng!);
              handleSelectedPickup({ id: id, lat: lat, lng: lng, info: info });
            }
          });
      });

      // Gọi API ORS để lấy đường đi
      fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: apiKey,
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

    // 🔹 Nếu có nhiều tuyến (routeDetailsList), hiển thị tất cả
    if (routeDetailsList && routeDetailsList.length > 0) {
      routeDetailsList.forEach((routeDetailItem, index) => {
        const sortedRoute = [...routeDetailItem.routeDetails].sort(
          (a, b) => a.order! - b.order!
        );

        // Lấy danh sách coordinates cho API ORS [lng, lat]
        const coordinates: [number, number][] = sortedRoute.map((item) => [
          item.pickup!.lng!,
          item.pickup!.lat!,
        ]);

        // Marker cho từng điểm trong tuyến
        sortedRoute.forEach((item) => {
          const { id, name, category, lat, lng } = item.pickup!;
          L.marker([lat!, lng!], { icon: getIconByType(category) })
            .addTo(map)
            .bindPopup(
              `<b style="font-size: 0.9rem;font-weight: 500;">${name}</b><br>
          - Loại trạm: ${category}<br>
          - Toạ độ x:${lat}<br>
          - Toạ độ y:${lng}`
            )
            .addEventListener("click", async () => {
              if (handleSelectedPickup) {
                const info = await getLocationInfo(lat!, lng!);
                handleSelectedPickup({
                  id: id,
                  lat: lat,
                  lng: lng,
                  info: info,
                });
              }
            });
        });

        // 🎨 Xác định màu tuyến theo trạng thái
        const routeColor =
          routeDetailItem.status === ActiveStatusValue.success
            ? "purple"
            : routeDetailItem.status === ActiveStatusValue.running
            ? "green"
            : routeDetailItem.status === ActiveStatusValue.incident
            ? "red"
            : "gray";

        // Gọi API ORS để lấy đường đi
        fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            // Vẽ đường đi thực tế
            L.geoJSON(data, {
              style: { color: routeColor, weight: 4, opacity: 0.7 },
            }).addTo(map);

            // 🚍 Hiển thị xe buýt nếu có activePickups
            if (activePickups && activePickups.length > 0) {
              // Lọc ra các trạm đã đến
              const reachedPickups = activePickups.filter(
                (p) => p.status === ActivePickupStatusValue.confirmed
              );

              let busLat: number | null = null;
              let busLng: number | null = null;

              // ✅ Lấy trạm đã đến có order cao nhất (xa nhất trên tuyến)
              const reachedPickupWithHighestOrder = reachedPickups.reduce(
                (prev, curr) => {
                  const prevOrder =
                    sortedRoute.find((r) => r.pickup?.id === prev?.pickup?.id)
                      ?.order ?? 0;
                  const currOrder =
                    sortedRoute.find((r) => r.pickup?.id === curr?.pickup?.id)
                      ?.order ?? 0;
                  return currOrder > prevOrder ? curr : prev;
                },
                reachedPickups[0]
              );
              if (reachedPickupWithHighestOrder) {
                busLat = reachedPickupWithHighestOrder?.pickup?.lat!;
                busLng = reachedPickupWithHighestOrder?.pickup?.lng!;
              } else {
                // ❌ Nếu chưa có trạm nào "Đã đến" → xe ở trạm đầu tiên
                const firstPickup = sortedRoute[0].pickup!;
                busLat = firstPickup.lat!;
                busLng = firstPickup.lng!;
              }

              // 🚌 Vẽ marker xe buýt
              if (busLat && busLng) {
                const busIcon = L.icon({
                  iconUrl:
                    "https://cdn-icons-png.flaticon.com/512/1068/1068580.png",
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                  popupAnchor: [0, -15],
                });

                L.marker([busLat, busLng], { icon: busIcon })
                  .addTo(map)
                  .bindPopup(
                    `<b>🚌 Xe buýt</b><br>Tọa độ: ${busLat.toFixed(
                      6
                    )}, ${busLng.toFixed(6)}`
                  )
                  .addEventListener("click", () => {
                    // Chỉ cần lấy mã trạm đầu tiên của tuyến là đủ truy được
                    handleSelectedBus!({
                      activePickupId: reachedPickupWithHighestOrder?.pickup?.id,
                    });
                  });
              }
            }
          })
          .catch((err) => console.error(err));
      });

      // Zoom để hiển thị toàn bộ tuyến
      const allLatLngs = routeDetailsList.flatMap((routeDetailItem) =>
        routeDetailItem?.routeDetails.map(
          (item) => [item.pickup!.lat!, item.pickup!.lng!] as L.LatLngTuple
        )
      );
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // 🎯 Nếu là chế độ "select", cho phép chọn điểm
    if (type == "select" && handleSelectedPickup) {
      map.on("click", async (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Xoá marker cũ
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng], {
          icon: getIconByType(pointType),
        }).addTo(map);

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
        handleSelectedPickup({ lat: lat, lng: lng, info: info });
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
    lat,
    lng,
    type,
    pointType,
    routeDetails,
    handleSelectedPickup,
    handleSelectedBus,
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
