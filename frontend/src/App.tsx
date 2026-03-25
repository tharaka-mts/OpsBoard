import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
