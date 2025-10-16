import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//
const ParentMapPage = () => {
  return (
    <>
      <div className="client-layout__main">
        <h2 className="client-layout__title">
          <span>
            <FontAwesomeIcon icon={faMapLocationDot} />
            <strong>Bản đồ</strong>
          </span>
        </h2>
        Đây là trang bản đồ của phụ huynh
      </div>
    </>
  );
};

export default ParentMapPage;
