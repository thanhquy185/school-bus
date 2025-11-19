import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout";
import ClientLayout from "../layouts/client-layout";
import MapPage from "../pages/admin/map-page";
import InformPage from "../pages/admin/inform-page";
import RoutePage from "../pages/admin/route-page";
import PickupPage from "../pages/admin/pickup-page";
import BusPage from "../pages/admin/bus-page";
import DriverPage from "../pages/admin/driver-page";
import ParentPage from "../pages/admin/parent-page";
import StudentPage from "../pages/admin/student-page";
import ParentInfoPage from "../pages/parents/info-page";
import ParentStudentPage from "../pages/parents/student-page";
import LoginPage from "../pages/public/login-page";
import ErrorPage from "../pages/public/error-page";
import UnauthorizedPage from "../pages/public/unauthorized-page";
import ParentJourneyPage from "../pages/parents/journey-page";
import SchedulePage from "../pages/admin/schedule-page";

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
          path: "informs",
          element: <InformPage />,
        },
        {
          path: "routes",
          element: <RoutePage />,
        },
        {
          path: "schedules",
          element: <SchedulePage />,
        },
        {
          path: "pickups",
          element: <PickupPage />,
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
          path: "parents",
          element: <ParentPage />,
        },
        {
          path: "students",
          element: <StudentPage />,
        },
      ],
    },
    {
      path: "/driver",
      element: <ClientLayout role="driver" />,
      errorElement: <ErrorPage />,
      children: [],
    },
    {
      path: "/parent",
      element: <ClientLayout role="parent" />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "journey",
          element: <ParentJourneyPage />,
        },
        {
          path: "info",
          element: <ParentInfoPage />,
        },
        {
          path: "student",
          element: <ParentStudentPage />,
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
