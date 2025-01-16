import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
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
      element: <HomePage />,
      protected: false // Home page doesn't need protection
    },
    {
      path: "/category/:category",
      element: <CategoryPage />,
      protected: true
    },
    {
      path: "/add-form",
      element: <AddForm />,
      protected: true
    },
    {
      path: "/cart",
      element: <Cart />,
      protected: true
    },
  ];

  const queryClient = new QueryClient();

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Routes>
                  {routeMap.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.protected ? (
                          <ProtectedRoute>{route.element}</ProtectedRoute>
                        ) : (
                          route.element
                        )
                      }
                    />
                  ))}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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