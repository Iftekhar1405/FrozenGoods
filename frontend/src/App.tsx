import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cart from "./components/Cart";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AddForm from "./pages/AddForm";
import { AuthPage } from "./pages/Auth";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";


const App: React.FC = () => {
  const routeMap = [
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/category/:category",
      element: <CategoryPage />
    },
    {
      path: "/add-form",
      element: <AddForm />
    },
    {
      path: "/cart",
      element: <Cart />
    },


  ]
  const queryCliet = new QueryClient()
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryCliet}>
        <CartProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Routes>
                  {routeMap.map((route, index) => (
                    <Route key={index} path={route.path} element={
                      <ProtectedRoute>
                        {route.element}
                      </ProtectedRoute>
                    }
                    />
                  ))}
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </Layout>
            </Router>
          </AuthProvider>
        </CartProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
