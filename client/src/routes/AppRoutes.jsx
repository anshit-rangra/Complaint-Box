import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home"
import Admin from "../pages/Admin"
import { useHydrateToken } from "../utils/token";


const AppRoutes = () => {

    useHydrateToken()
    
     

    const routes = createBrowserRouter([
        {
            path:"/",
            element: <Home />
        },
        {
            path:"/admin",
            element: <Admin />
        }
    ])

  return (
    <>
    <RouterProvider router={routes} />
    </>
  )
}

export default AppRoutes