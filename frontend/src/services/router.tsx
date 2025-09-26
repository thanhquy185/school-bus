import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout";
import LoginPage from "../pages/public/login-page";
import ErrorPage from "../pages/public/error-page";
import UnauthorizedPage from "../pages/public/unauthorized-page";
import DriverPage from "../pages/admin/driver-page";
import RelationPage from "../pages/admin/relation-page";
import StudentPage from "../pages/admin/student-page";
import BusPage from "../pages/admin/bus-page";
import JourneyPage from "../pages/admin/journey-page";
import MapPage from "../pages/admin/map-page";

// Router giúp chuyển hướng trang
export const getRouter = async (): Promise<
  ReturnType<typeof createBrowserRouter>
> => {
  return createBrowserRouter([
    {
      path: "/admin",
      element: <AdminLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "map",
          element: <MapPage />,
        },
        {
          path: "journeys",
          element: <JourneyPage />,
        },
        {
          path: "buses",
          element: <BusPage />,
        },
        {
          path: "drivers",
          element: <DriverPage />,
        },
        {
          path: "relations",
          element: <RelationPage />,
        },
        {
          path: "students",
          element: <StudentPage />,
          children: [
            {
              path: "list",
              element: <StudentPage/>
            },
            {
              path: "create",
              element: <StudentPage/>
            },
            {
              path: "update",
              element: <StudentPage/>
            },
            {
              path: "lock",
              element: <StudentPage/>
            }
          ]
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
  ]);
};
