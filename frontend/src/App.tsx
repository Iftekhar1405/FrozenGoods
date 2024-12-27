import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Cart from "./components/Cart";
import Layout from "./components/Layout";
import QRScanner from "./components/QRScanner";
import { CartProvider } from "./context/CartContext";
import AddForm from "./pages/AddForm";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import { path } from "framer-motion/client";
import LoginComponent from "./components/demo-login";
import RegisterComponent from "./components/demo-register";


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
    {
      path: "/scan",
      element: <QRScanner />
    },
    {
      path: "/auth",
      element: <AuthForm />
    },
    {
      path: "/login",
      element: <LoginComponent/>
    },
    {
      path: "/register",
      element: <RegisterComponent />
    }

  ]
  const queryCliet = new QueryClient()
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryCliet}>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                {routeMap.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
