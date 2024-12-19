import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cart from "./components/Cart";
import Layout from "./components/Layout";
import QRScanner from "./components/QRScanner";
import { CartProvider } from "./context/CartContext";
import AddForm from "./pages/AddForm";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";


const App: React.FC = () => {

  const queryCliet = new QueryClient()
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryCliet}>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/add-form" element={<AddForm />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/scan" element={<QRScanner />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
