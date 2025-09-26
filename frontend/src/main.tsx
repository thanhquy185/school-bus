import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CustomSpinner from "./components/spinner";
import { getRouter } from "./services/router";
import "./utils/i18n";
import "./assets/styles/css/main.css";
import { ConfigProvider } from "antd";
import { App as AntdApp } from "antd";

// App
const App = () => {
  // Biến giữ giá trị router
  // Chú thích
  // - Tạo một biến router trong React để lưu router.
  // - Kiểu dữ liệu: giống kiểu do createBrowserRouter() trả về, hoặc null.
  // - Dùng setRouter(...) để cập nhật khi router được load xong bất đồng bộ.
  const [router, setRouter] = useState<ReturnType<
    typeof createBrowserRouter
  > | null>(null);

  useEffect(() => {
    const loadRouter = async () => {
      const routerResult = await getRouter();
      setRouter(routerResult);
    };
    loadRouter();
  }, []);

  return router ? (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#003366",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  ) : (
    <CustomSpinner />
  );
};

//  Dấu ! sau document.getElementById("root")! trong TypeScript có tên là non-null assertion operator (toán tử khẳng định không null).
createRoot(document.getElementById("root")!).render(
  <AntdApp>
    <App />
  </AntdApp>
);
