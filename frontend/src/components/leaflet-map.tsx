import React, { useEffect, useRef, useState } from "react";
import L, { type LeafletMouseEvent, type Icon, bounds, Bounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import polyline from "@mapbox/polyline";
import Swal from "sweetalert2";
import {
  ActivePickupStatusValue,
  ActiveStatusValue,
  PointTypeValue,
} from "../common/values";
import type {
  ActivePickupFormatType,
  BusInfoType,
  BusType,
  RouteDetailsFormatType,
  ScheduleFormatType,
} from "../common/types";
import { getLocationInfo } from "../utils/getLocationInfo";
import { calDistance } from "../utils/busEvents";

export interface BusSimulationState {
  currentIndex: number;
  step: number;
  lat?: number;
  lng?: number;
}

export type HandleGetBusInfoProps = {
  activeId?: number;
  busLat?: number;
  busLng?: number;
  busSpeed?: number;
};

export type HandleGetRouteInfoProps = {
  distance?: number;
  duration?: number;
};

export type HandleSelectedPickupProps = {
  id?: number;
  name?: string;
  category?: string;
  lat?: number;
  lng?: number;
  info?: any;
};

export type HandleSelectedBusProps = {
  activeId?: number;
};

// Props
interface LeafletMapProps {
  id?: string;
  height?: number | string;
  type?: "select" | "detail";
  defaultCenter?: [number, number];
  defaultZoom?: number;
  enableZoom?: boolean;
  enableSearch?: boolean;
  enableBaseLayers?: boolean;
  hidden?: boolean,
  lat?: number;
  lng?: number;
  pointType?: string;
  busInfos?: BusInfoType[];
  routeDetails?: RouteDetailsFormatType[];
  routeDetailsList?: {
    activeId?: number;
    routeDetails: RouteDetailsFormatType[];
    status: string;
  }[];
  activePickupsList?: {
    activeId?: number;
    activePickups?: ActivePickupFormatType[];
  }[];
  handleGetBusInfo?: ({
    activeId,
    busLat,
    busLng,
    busSpeed,
  }: HandleGetBusInfoProps) => void;
  handleGetRouteInfo?: ({
    distance,
    duration,
  }: HandleGetRouteInfoProps) => void;
  handleSelectedPickup?: ({
    id,
    name,
    category,
    lat,
    lng,
    info,
  }: HandleSelectedPickupProps) => void;
  handleSelectedBus?: ({ activeId }: HandleSelectedBusProps) => void;
}

// Api (sử dụng như nào phải ghi chú á, chứ không lúc demo api cũng hết lượt là về luôn...)
const apiKeyQuy =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAzNTQ5M2E2YWEwMjQwZWQ5Njc3NGQ1OGMzNDgyMzJlIiwiaCI6Im11cm11cjY0In0=";
const apiKeyDuc =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBlNGQ5Njc1N2JhMDRmMGFiODcxYzdlY2Y5MjA2ODRiIiwiaCI6Im11cm11cjY0In0=";
const apiKeyNhi =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjkzNmRmMWNmYjRjYzQ3ZmU5YWE5NjRjNmQxZDlkNDBlIiwiaCI6Im11cm11cjY0In0=";
const apiKeyNgan =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjliYzA1ZGE1N2VlNTRmZmViZDk3ZDQ5NWQ2OWUxN2NkIiwiaCI6Im11cm11cjY0In0=";
const apiKeyDuong = "";
const apiKeyLuan =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNjOGY5YzMzZGE0ODQ1ODViMTY5MjZjM2ZiNTcyNWJkIiwiaCI6Im11cm11cjY0In0=";
const apiKeySelected = apiKeyDuc;

// Các bản đồ nền
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
const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution:
    "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap",
});

const LeafletMap: React.FC<LeafletMapProps> = ({
  id,
  height = 400,
  type = "select",
  defaultCenter = [10.762622, 106.660172],
  defaultZoom = 13,
  enableZoom = true,
  enableSearch = true,
  enableBaseLayers = true,
  hidden = false,
  lat,
  lng,
  pointType,
  routeDetails,
  routeDetailsList,
  busInfos,
  activePickupsList,
  handleGetBusInfo,
  handleGetRouteInfo,
  handleSelectedPickup,
  handleSelectedBus,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const infoBlockRef = useRef<L.Control | null>(null);
  const routeRefs = useRef<L.Polyline[]>([]);
  const busMarkersRef = useRef<Record<number, L.Marker>>({});
  const pickupMarkersRef = useRef<L.Marker[]>([]);
  const busSimulationState = useRef<
    Record<string | number, BusSimulationState>
  >({});

  // Helper icon
  const getIconByType = (type?: string): Icon => {
    if (type === PointTypeValue.school)
      return L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    if (type === PointTypeValue.pickup)
      return L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/6395/6395324.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    if (type === PointTypeValue.bus)
      return L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/1068/1068580.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    return L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // Khởi tạo map 1 lần
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(id || "leaflet-map", {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: enableZoom,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      if (enableBaseLayers) {
        const baseMaps = {
          "Bản đồ trắng": light,
          "Bản đồ đường": street,
          "Bản đồ vệ tinh": satellite,
          "Bản đồ tối": dark,
          "Bản đồ địa hình": topo,
        };
        L.control.layers(baseMaps).addTo(mapRef.current);
      }

      if (enableSearch) {
        (L.Control as any)
          .geocoder({ defaultMarkGeocode: false })
          .on("markgeocode", (e: any) => {
            const latlng = e.geocode.center;
            mapRef.current!.setView(latlng, 15);
            L.marker(latlng)
              .addTo(mapRef.current!)
              .bindPopup(`<b>${e.geocode.name}</b>`)
              .openPopup();
          })
          .addTo(mapRef.current);
      }

      if (type === "select" && handleSelectedPickup) {
        mapRef.current.on("click", async (e: LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) mapRef.current!.removeLayer(markerRef.current);
          markerRef.current = L.marker([lat, lng], {
            icon: getIconByType(pointType),
          }).addTo(mapRef.current!);
          markerRef.current
            .bindPopup(
              `<b>${pointType || "Tọa độ"}</b><br>${lat.toFixed(
                6
              )},${lng.toFixed(6)}`
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
          handleSelectedPickup({ lat, lng, info });
        });
      }

      // if (type === "detail") {
      //   mapRef.current.dragging.enable();
      //   mapRef.current.doubleClickZoom.enable();
      //   mapRef.current.scrollWheelZoom.enable();
      //   mapRef.current.boxZoom.enable();
      //   mapRef.current.keyboard.enable();
      // }
    }
  }, []);

  // Update marker khi lat - lng - pointType thay đổi
  useEffect(() => {
    if (mapRef.current && lat != null && lng != null && pointType != null) {
      if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
      markerRef.current = L.marker([lat, lng], {
        icon: getIconByType(pointType),
      }).addTo(mapRef.current);

      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  }, [lat, lng, pointType]);

  useEffect(() => {
    if (!mapRef.current || !routeDetails || routeDetails.length === 0) return;

    // Xóa marker cũ
    pickupMarkersRef.current.forEach((m) => mapRef.current!.removeLayer(m));
    pickupMarkersRef.current = [];

    // Xóa tuyến cũ
    routeRefs.current.forEach((r) => mapRef.current!.removeLayer(r));
    routeRefs.current = [];

    // Xóa infoBlock cũ
    if (infoBlockRef.current) {
      mapRef.current.removeControl(infoBlockRef.current);
      infoBlockRef.current = null;
    }

    const sortedRoute = [...routeDetails].sort((a, b) => a.order! - b.order!);

    // Chuẩn bị coordinates cho ORS [lng, lat]
    const coordinates: [number, number][] = sortedRoute.map((item) => [
      item.pickup!.lng!,
      item.pickup!.lat!,
    ]);

    // Tạo marker cho từng điểm
    sortedRoute.forEach((item) => {
      const { id, name, category, lat, lng } = item.pickup!;
      const marker = L.marker([lat!, lng!], {
        icon: getIconByType(category),
      }).addTo(mapRef.current!);
      marker.bindPopup(
        `<b style="font-size: 0.9rem;font-weight: 500;">${name}</b><br>- Loại trạm: ${category}<br>- Toạ độ x:${lat}<br>- Toạ độ y:${lng}`
      );
      marker.on("click", async () => {
        if (handleSelectedPickup) {
          const info = await getLocationInfo(lat!, lng!);
          handleSelectedPickup({ id, lat, lng, info });
        }
      });
      pickupMarkersRef.current.push(marker);
    });

    // Gọi API ORS để lấy đường đi
    fetch("https://api.openrouteservice.org/v2/directions/driving-car/json", {
      method: "POST",
      headers: {
        Authorization: apiKeySelected,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates }),
    })
      .then((res) => res.json())
      .then((data) => {
        const route = data.routes[0];
        const totalDistance = route.summary.distance; // mét
        const totalDuration = route.summary.duration; // giây

        // Giải mã geometry để vẽ đường
        const decoded = polyline.decode(route.geometry);
        const polylineLine = L.polyline(decoded, {
          color: "blue",
          weight: 4,
          opacity: 0.6,
        }).addTo(mapRef.current!);
        routeRefs.current.push(polylineLine);

        // Zoom map vừa tất cả các điểm
        const latlngs = sortedRoute.map(
          (item) => [item.pickup!.lat!, item.pickup!.lng!] as L.LatLngTuple
        );
        const bounds = L.latLngBounds(latlngs);
        mapRef.current!.fitBounds(bounds, { padding: [50, 50] });

        // Tạo block hiển thị thông tin tuyến đường
        const infoBlock = new L.Control({ position: "bottomleft" });
        infoBlock.onAdd = () => {
          const div = L.DomUtil.create("div", "info-block"); // class CSS là info-block
          div.innerHTML = `
          <p class="title">Thông tin tuyến đường</p>
          <p class="description">- Tổng quãng đường: <b>${totalDistance.toFixed(
            0
          )} m</b></p>
          <p class="description">- Thời gian dự kiến: <b>${totalDuration.toFixed(
            0
          )} s</b></p>
        `;
          return div;
        };
        infoBlock.addTo(mapRef.current!);
        infoBlockRef.current = infoBlock;

        handleGetRouteInfo?.({
          distance: totalDistance.toFixed(0),
          duration: totalDuration.toFixed(0),
        });
      })
      .catch((err) => console.error(err));
  }, [routeDetails]);

  useEffect(() => {
    if (!mapRef.current || !routeDetailsList) return;

    // Xóa tuyến cũ
    routeRefs.current.forEach((r) => mapRef.current!.removeLayer(r));
    routeRefs.current = [];

    // Xóa marker trạm cũ
    pickupMarkersRef.current.forEach((m) => mapRef.current!.removeLayer(m));
    pickupMarkersRef.current = [];

    // Xóa các marker xe buýt
    Object.values(busMarkersRef.current).forEach((m) =>
      mapRef.current!.removeLayer(m)
    );
    busMarkersRef.current = {};

    // Xóa infoBlock cũ
    if (infoBlockRef.current) {
      mapRef.current!.removeControl(infoBlockRef.current);
      infoBlockRef.current = null;
    }

    routeDetailsList.forEach(async (routeItem) => {
      const sortedRoute = [...routeItem.routeDetails].sort(
        (a, b) => a.order! - b.order!
      );

      // 🧭 Tạo danh sách toạ độ (lng, lat)
      const coordinates: [number, number][] = sortedRoute.map((r) => [
        r.pickup!.lng!,
        r.pickup!.lat!,
      ]);

      // 🪧 Vẽ marker trạm
      sortedRoute.forEach((r) => {
        const { lat, lng, category, name, id } = r.pickup!;
        const m = L.marker([lat!, lng!], {
          icon: getIconByType(category),
        }).addTo(mapRef.current!);

        m.bindPopup(`<b>${name}</b><br>Loại: ${category}`);
        m.on("click", async () => {
          const info = await getLocationInfo(lat!, lng!);
          handleSelectedPickup?.({ id, lat, lng, info, name, category });
        });

        pickupMarkersRef.current.push(m);
      });

      // 🛣️ Vẽ tuyến
      try {
        const res = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/json",
          {
            method: "POST",
            headers: {
              Authorization: apiKeySelected,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates }),
          }
        );
        const data = await res.json();
        const route = data.routes[0];
        const decoded = polyline.decode(route.geometry);

        const routeColor =
          routeItem.status === ActiveStatusValue.success
            ? "purple"
            : routeItem.status === ActiveStatusValue.running
            ? "green"
            : routeItem.status === ActiveStatusValue.incident
            ? "red"
            : "gray";

        const line = L.polyline(decoded, { color: routeColor, weight: 4 });
        line.addTo(mapRef.current!);
        routeRefs.current.push(line);

        // 📊 Nếu chỉ có 1 tuyến => thêm khung thông tin
        if (routeDetailsList.length === 1) {
          const totalDistance = route.summary.distance;
          const totalDuration = route.summary.duration;

          const infoBlock = new L.Control({ position: "bottomleft" });
          infoBlock.onAdd = () => {
            const div = L.DomUtil.create("div", "info-block in-tag");
            div.innerHTML = `
            <p class="title">Thông tin tuyến đường</p>
            <p class="description">- Tổng quãng đường: <b>${totalDistance.toFixed(
              0
            )} m</b></p>
            <p class="description">- Thời gian dự kiến: <b>${totalDuration.toFixed(
              0
            )} s</b></p>`;
            return div;
          };
          infoBlock.addTo(mapRef.current!);
          infoBlockRef.current = infoBlock;

          handleGetRouteInfo?.({
            distance: totalDistance,
            duration: totalDuration,
          });
        }
      } catch (err) {
        console.error("Lỗi khi vẽ tuyến:", err);
      }
    });

    // 🎯 Căn giữa bản đồ
    const allLatLngs = routeDetailsList.flatMap((routeDetailItem) =>
      routeDetailItem?.routeDetails.map(
        (item) => [item.pickup!.lat!, item.pickup!.lng!] as L.LatLngTuple
      )
    );

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeDetailsList]);

  useEffect(() => {
    if (!mapRef.current || !busInfos?.length) return;

    busInfos.forEach((busInfo) => {
      if (!busInfo) return;
      const { activeId, busLat, busLng } = busInfo;
      if (!activeId || busLat == null || busLng == null) return;

      // ✅ Ưu tiên vị trí mới nhất trong simulation nếu có
      const simState = busSimulationState.current[activeId];
      const lat = simState?.lat ?? busLat;
      const lng = simState?.lng ?? busLng;

      let busMarker = busMarkersRef.current[activeId];
      if (!busMarker) {
        busMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1068/1068580.png",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
          }),
        }).addTo(mapRef.current!);

        busMarker.on("click", () => handleSelectedBus?.({ activeId }));
        busMarkersRef.current[activeId] = busMarker;
      } else {
        busMarker.setLatLng([lat, lng]);
      }
    });
  }, [busInfos]);

  // useEffect(() => {
  //   function handleBusPositionUpdated(e: Event) {
  //     const customEvent = e as CustomEvent<{
  //       activeId: number;
  //       lat: number;
  //       lng: number;
  //     }>;
  //     const { activeId, lat, lng } = customEvent.detail;
  //     const marker = busMarkersRef.current[activeId];
  //     if (marker) marker.setLatLng([lat, lng]);
  //   }

  //   window.addEventListener(
  //     "busPositionUpdated",
  //     handleBusPositionUpdated as EventListener
  //   );
  //   return () =>
  //     window.removeEventListener(
  //       "busPositionUpdated",
  //       handleBusPositionUpdated as EventListener
  //     );
  // }, []);

  useEffect(() => {
    if (
      type !== "detail" ||
      !mapRef.current ||
      !busInfos?.length ||
      !routeDetailsList?.length ||
      !activePickupsList?.length
    ) return

    console.log("🚍 simulate bus moving...");

    const mergedList = routeDetailsList
      ?.map((route) => {
        const busInfo = busInfos.find(
          (busInfo) => busInfo.activeId === route.activeId
        );
        if (!busInfo) return null;

        const activePickupsItem = activePickupsList.find(
          (p) => p.activeId === route.activeId
        );

        const detailedRoute =
          route.routeDetails
            ?.map((routeDetail) => {
              const activePickup = activePickupsItem?.activePickups?.find(
                (ap) => ap?.pickup?.id === routeDetail?.pickup?.id
              );
              return {
                order: routeDetail?.order,
                activePickup: activePickup ?? null,
              };
            })
            ?.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)) ?? [];

        return {
          activeId: route.activeId,
          busLat: busInfo.busLat,
          busLng: busInfo.busLng,
          routeDetails: detailedRoute,
        };
      })
      ?.filter(Boolean);

    mergedList?.forEach((mergedBus) => {
      const { activeId, busLat, busLng, routeDetails } = mergedBus!;
      if (!activeId || !routeDetails?.length) return;

      // Đọc trạng thái cũ nếu có
      let state = busSimulationState.current[activeId];
      if (!state) {
        state = { currentIndex: 0, step: 0 };
        busSimulationState.current[activeId] = state;
      }

      let { currentIndex, step } = state;

      const moveInterval = 100; // 5 giây / bước
      const totalSteps = 1000; // 4 bước

      function moveBus() {
        if (currentIndex >= routeDetails.length - 1) return;

        const start = routeDetails[currentIndex]?.activePickup?.pickup;
        const end = routeDetails[currentIndex + 1]?.activePickup?.pickup;
        if (!start || !end) return;

        const isNextDriving = routeDetails.some(
          (p) =>
            p?.activePickup?.pickup?.id === end.id &&
            p?.activePickup?.status === ActivePickupStatusValue.driving
        );
        if (!isNextDriving) return;

        const interval = setInterval(() => {
          step++;
          const lat =
            start.lat! + ((end.lat! - start.lat!) * step) / totalSteps;
          const lng =
            start.lng! + ((end.lng! - start.lng!) * step) / totalSteps;

          const busMarker = busMarkersRef.current[activeId!];
          busMarker?.setLatLng([lat, lng]);

          // ✅ Cập nhật lại vị trí thực tế
          handleGetBusInfo?.({
            activeId,
            busLat: lat,
            busLng: lng,
          });

          // 🔸 Lưu lại trạng thái hiện tại
          busSimulationState.current[activeId!] = {
            currentIndex,
            step,
            lat,
            lng,
          };

          window.dispatchEvent(
            new CustomEvent("busPositionUpdated", {
              detail: { activeId, lat, lng },
            })
          );

          if (step >= totalSteps) {
            clearInterval(interval);
            console.log(`✅ Xe ${activeId} đến trạm: ${end.name}`);
            currentIndex++;
            step = 0;
            busSimulationState.current[activeId!] = {
              currentIndex,
              step,
              lat: end.lat,
              lng: end.lng,
            };
            moveBus(); // tiếp tục di chuyển tới trạm kế tiếp
          }
        }, moveInterval);
      }

      moveBus();
    });
  }, [busInfos, routeDetailsList, activePickupsList]);

  return (
    <div
      id={id || "leaflet-map"}
      className="leaflet-map"
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        borderRadius: "8px",
      }}
      hidden={hidden}
    ></div>
  );
};

export default LeafletMap;
