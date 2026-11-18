import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        VinylVault
      </Link>
      <nav>
        <Link to="/checkout">Checkout</Link>
      </nav>
    </header>
  );
}

export default Navbar;
