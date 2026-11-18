# Assignment 3A & 3B:

## VinylVault Indie Record Online Store

VinylVault is a Single-Page Application built with React and Vite. Made for vinyl collectors.

---

## 1. Project Setup & Execution Instructions

### Installation Procedure

1. **Clone the repository**
   git clone <your-repository-url>
   cd vinylvault
2. **Install project dependencies**
   npm install

### Running the Development Server

1. **Start the Vite development server:**
   npm run dev
2. **Verify browser connection:**
   Open your browser and navigate to the local URL output in your terminal.

### Project Directory Structure

- `index.html`, `package.json`, `vite.config.js`, and `README.md` in the root for build configuration and documentation.
- `src/data/` stores the static `albums.js` product catalog dataset, while `src/assets/` holds local multimedia files.
- `src/pages/` contains different view pages (`CatalogPage.jsx`, `AlbumDetailPage.jsx`, `CheckoutPage.jsx`), and `src/components/` has reusable UI elements (`Navbar.jsx`, `CartDrawer.jsx`, `AlbumCard.jsx`).
- `src/App.jsx`, `src/main.jsx`, and `src/styles.css` manage whole page setup and styling.

---

## 2. React Component Hierarchy & State Flow Architecture

The diagram below outlines the complete component decomposition, lifted state ownership, unidirectional prop flow, event callbacks, and React Router mappings for VinylVault.

```text
<App /> ──> src/App.jsx
├── Owned State:
│   ├── cart (Array of Objects): Stores line items [{ album, quantity }] lifted to keep Navbar, CartDrawer, and CheckoutPage synchronized.
│   └── isCartOpen (Boolean): Controls the open/closed visibility state of the slide-over CartDrawer.
├── Callback Handlers Defined & Passed Down:
│   ├── onAddToCart(album: Object): Immutably adds a new album or increments quantity if already in cart.
│   ├── onUpdateQuantity(albumId: String|Number, delta: Number): Immutably increments/decrements item quantity (removes if 0).
│   ├── onRemoveFromCart(albumId: String|Number): Immutably filters out a specific album from cart.
│   ├── onClearCart(): Resets cart state to an empty array [] upon successful checkout.
│   └── onToggleCart(): Toggles isCartOpen boolean state.
│
├── <Navbar /> ──> src/components/Navbar.jsx (Persistent Sticky Header)
│   ├── Props Received:
│   │   ├── cartCount (Number): Derived total quantity of items across all cart entries.
│   │   └── onToggleCart (Function): Callback triggered when clicking the cart badge button.
│   └── Navigation: Uses React Router <Link> components for client-side navigation to "/".
│
├── <CartDrawer /> ──> src/components/CartDrawer.jsx (Persistent Slide-Over Panel)
│   ├── Props Received:
│   │   ├── isOpen (Boolean): Determines whether the drawer is visible/slid open.
│   │   ├── cart (Array of Objects): Current line items to render and calculate subtotals from.
│   │   ├── onClose (Function): Callback (maps to onToggleCart) to close the drawer.
│   │   ├── onUpdateQuantity (Function): Callback passed to +/- quantity buttons.
│   │   └── onRemove (Function): Callback passed to item delete buttons.
│   └── Navigation: Uses useNavigate() or <Link> to transition to "/checkout" and closes drawer.
│
└── <Routes> (React Router v6 Client-Side Route Switch)
    │
    ├── <Route path="/" element={<CatalogPage />} /> ──> src/pages/CatalogPage.jsx
    │   ├── Owned State:
    │   │   └── selectedGenre (String): Tracks active filter ("All", "Jazz", "Electronic", "Rock", "Classical"); defaults to "All".
    │   ├── Props Received:
    │   │   ├── albums (Array of Objects): Full catalog imported from src/data/albums.js.
    │   │   └── onAddToCart (Function): Passed down to individual album cards.
    │   ├── Callback Handlers:
    │   │   └── onSelectGenre(genre: String): Updates selectedGenre state.
    │   │
    │   ├── <CatalogHero /> ──> src/components/CatalogHero.jsx
    │   │   └── Props Received: None (Presentational banner component).
    │   │
    │   ├── <GenreFilterBar /> ──> src/components/GenreFilterBar.jsx
    │   │   └── Props Received:
    │   │       ├── genres (Array of Strings): ["All", "Jazz", "Electronic", "Rock", "Classical"].
    │   │       ├── selectedGenre (String): Highlights the currently active genre button.
    │   │       └── onSelectGenre (Function): Callback fired on button click.
    │   │
    │   └── <AlbumGrid /> ──> src/components/AlbumGrid.jsx
    │       ├── Props Received:
    │       │   ├── filteredAlbums (Array of Objects): Derived array of albums matching selectedGenre.
    │       │   └── onAddToCart (Function): Forwarded to each child card.
    │       │
    │       └── <AlbumCard /> ──> src/components/AlbumCard.jsx (Rendered via .map() iterator)
    │           └── Props Received:
    │               ├── album (Object): Individual record metadata (id, title, artist, price, cover, genre).
    │               └── onAddToCart (Function): Callback invoked by the "Add to Cart" button.
    │
    ├── <Route path="/album/:albumId" element={<AlbumDetailPage />} /> ──> src/pages/AlbumDetailPage.jsx
    │   ├── Route Parameters: Extracts `albumId` via React Router `useParams()` to look up the matching album in `albums.js`.
    │   ├── Props Received:
    │   │   └── onAddToCart (Function): Callback invoked when adding the inspected vinyl to cart.
    │   └── Navigation: Uses <Link> to return to "/" without page reload.
    │
    └── <Route path="/checkout" element={<CheckoutPage />} /> ──> src/pages/CheckoutPage.jsx
        ├── Owned State:
        │   ├── formData (Object): Controlled input values { fullName, address, city, postalCode, cardDetails }.
        │   ├── errors (Object): Validation error messages mapped to field names.
        │   └── isOrderSubmitted (Boolean): Toggles between the checkout form and the order confirmation screen.
        ├── Props Received:
        │   ├── cart (Array of Objects): Used to render the itemized order summary and total price.
        │   └── onClearCart (Function): Invoked upon valid form submission to reset active cart state.
        └── Callback Handlers:
            ├── handleInputChange(event: SyntheticEvent): Updates formData state immutably on user typing.
            └── handleSubmit(event: SyntheticEvent): Calls event.preventDefault(), validates inputs, triggers onClearCart(), and sets isOrderSubmitted to true.
```
