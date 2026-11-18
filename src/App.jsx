import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ALBUMS } from "./data/albums.js";
import Navbar from "./components/Navbar.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import AlbumDetailPage from "./pages/AlbumDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  function handleAddToCart(album, quantity = 1) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === album.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === album.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevCart, { ...album, quantity }];
    });
    setIsCartOpen(true);
  }

  function handleUpdateQuantity(albumId, delta) {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === albumId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item) => item !== null),
    );
  }

  function handleRemoveFromCart(albumId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== albumId));
  }

  function handleClearCart() {
    setCart([]);
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <CatalogPage albums={ALBUMS} onAddToCart={handleAddToCart} />
            }
          />
          <Route
            path="/album/:albumId"
            element={
              <AlbumDetailPage albums={ALBUMS} onAddToCart={handleAddToCart} />
            }
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cart={cart} onClearCart={handleClearCart} />}
          />
        </Routes>
      </main>

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
}

export default App;
