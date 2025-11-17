import LeafletMap from "../leaflet-map";

interface MapTabProps {
  studentId?: number;
}

const MapTab = ({ studentId }: MapTabProps) => {
  return (
    <div className="w-full h-[620px]">
      <LeafletMap 
        id="map-parent-journey" 
        type="detail"
      />
    </div>
  );
};

export default MapTab;
