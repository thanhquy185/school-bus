import { PuffLoader } from "react-spinners";

const CustomSpinner = () => {
  return (
    <>
      <dialog
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 9999,
          display: "block",
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <PuffLoader
          color="#003366"
          loading
          size={100}
          speedMultiplier={1}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            display: "block",
            width: 100,
            height: 100,
          }}
        />
        <div
          style={{
            position: "absolute",
            zIndex: 9998,
            width: "100%",
            height: "100%",
            background: "rgba(200, 200, 200, 0.2)",
          }}
        ></div>
      </dialog>
    </>
  );
};

export default CustomSpinner;