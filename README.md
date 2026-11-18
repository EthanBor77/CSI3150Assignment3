# Assignment 3A & 3B:

## VinylVault Indie Record Online Store

VinylVault is a Single-Page Application built with React and Vite. Made for vinyl collectors.

---

## 1. Project Setup & Execution Instructions

### Prerequisites

- **Node.js v22.12 or newer**
- **npm v10+**
- **Git**
- A modern web browser.

### Installation Procedure

1. **Clone the repository:**
   git clone https://github.com/EthanBor77/CSI3150Assignment3.git
2. **Install project dependencies**
   npm install

### Running the Development Server

1. **Start the Vite development server:**
   npm run dev
2. **Verify the browser connection:**
   - The terminal prints a local URL, by default `http://localhost:5173/`.
   - Open that URL in your browser.

### Project Directory Structure

The project root holds the build and config files (`index.html`, `package.json`, `vite.config.js`) plus this `README.md`. All application code lives in `src/`, where `main.jsx` mounts `App.jsx` (the root component that owns the cart state and routes) and `style.css` holds the global styles. `src/pages/` contains the routed views (`CatalogPage`, `AlbumDetailPage`, `CheckoutPage`), and `src/components/` contains the reusable UI pieces (`Navbar`, `CartDrawer`, `AlbumCard`, and others). `src/data/albums.js` exports the `ALBUMS` product dataset, and `src/assets/` stores local media files.

---

## 2. React Component Hierarchy & State Flow Architecture

The diagram below outlines the complete component decomposition, lifted state ownership, unidirectional prop flow, event callbacks, and React Router mappings for VinylVault.

```text
<BrowserRouter> ──> src/main.jsx (Wraps <App /> to enable client-side routing)
│
└── <App /> ──> src/App.jsx (Root component; owns all shared state)
    ├── Owned State (useState):
    │   ├── cart (Array<{ album: Object, quantity: Number }>): Line items, lifted here so Navbar, CartDrawer,
    │   │     AlbumCard/AlbumDetailPage (adding), and CheckoutPage stay synchronized across routes. Default: [].
    │   └── isCartOpen (Boolean): Controls whether the slide-over CartDrawer is visible. Default: false.
    ├── Derived Values (computed each render, not stored in state):
    │   ├── cartCount (Number): cart.reduce((sum, item) => sum + item.quantity, 0)
    │   └── subtotal (Number): cart.reduce((sum, item) => sum + item.album.price * item.quantity, 0)
    ├── Callback Handlers Defined & Passed Down (all update state immutably via .map(), .filter(), spread):
    │   ├── onAddToCart(album: Object): Adds { album, quantity: 1 } or increments quantity if already in cart.
    │   ├── onUpdateQuantity(albumId: String, delta: Number): Adds +1/-1 to quantity; removes the item if it reaches 0.
    │   ├── onRemove(albumId: String): Filters the matching album out of cart.
    │   ├── onClearCart(): Resets cart to [] after a successful checkout.
    │   └── onToggleCart(): Flips isCartOpen (true <-> false).
    │
    ├── <Navbar /> ──> src/components/Navbar.jsx (Sticky header; rendered on every route)
    │   ├── Props Received:
    │   │   ├── cartCount (Number): Total item quantity shown in the cart badge.
    │   │   └── onToggleCart (Function): Called when the cart badge button is clicked.
    │   ├── Navigation: <Link to="/"> on the VinylVault logo (client-side, no reload).
    │   │
    │   └── <CartBadge /> ──> src/components/CartBadge.jsx (Cart button with item-count bubble)
    │       └── Props Received:
    │           ├── count (Number): Value of cartCount displayed in the badge.
    │           └── onClick (Function): Receives onToggleCart; fires on button click.
    │
    ├── <CartDrawer /> ──> src/components/CartDrawer.jsx (Slide-over panel; rendered on every route)
    │   ├── Props Received:
    │   │   ├── isOpen (Boolean): isCartOpen; applies the "open" CSS class to slide the panel in/out.
    │   │   ├── cart (Array<{ album, quantity }>): Line items to render.
    │   │   ├── subtotal (Number): Derived order subtotal to display.
    │   │   ├── onClose (Function): Receives onToggleCart; closes the drawer (close button / backdrop click).
    │   │   ├── onUpdateQuantity (Function): Forwarded to each CartItem's +/- buttons.
    │   │   └── onRemove (Function): Forwarded to each CartItem's delete button.
    │   ├── Callback Handlers:
    │   │   └── handleCheckout(): Calls onClose() then useNavigate()("/checkout").
    │   │
    │   └── <CartItem /> ──> src/components/CartItem.jsx (Rendered via cart.map() iterator, key = album.id)
    │       └── Props Received:
    │           ├── item ({ album: Object, quantity: Number }): The line item to display.
    │           ├── onUpdateQuantity (Function): Called as onUpdateQuantity(item.album.id, +1 | -1).
    │           └── onRemove (Function): Called as onRemove(item.album.id).
    │           (Line total = item.album.price * item.quantity, computed inline.)
    │
    └── <Routes> (React Router v6+ route switch; renders exactly one matching <Route>)
        │
        ├── <Route path="/" element={<CatalogPage />} /> ──> src/pages/CatalogPage.jsx   [ROUTED PAGE]
        │   ├── Owned State (useState):
        │   │   └── selectedGenre (String): Active filter: "All" | "Jazz" | "Electronic" | "Rock" | "Classical". Default: "All".
        │   ├── Props Received:
        │   │   ├── albums (Array<Object>): The ALBUMS dataset passed down from App.
        │   │   └── onAddToCart (Function): Forwarded to AlbumGrid -> AlbumCard.
        │   ├── Derived Values:
        │   │   └── filteredAlbums (Array<Object>): selectedGenre === "All" ? albums : albums.filter(a => a.genre === selectedGenre)
        │   ├── Callback Handlers:
        │   │   └── onSelectGenre(genre: String): Calls setSelectedGenre(genre).
        │   │
        │   ├── <CatalogHero /> ──> src/components/CatalogHero.jsx (Presentational banner)
        │   │   └── Props Received: None.
        │   │
        │   ├── <GenreFilterBar /> ──> src/components/GenreFilterBar.jsx (Button group for genre filtering)
        │   │   └── Props Received:
        │   │       ├── genres (Array<String>): ["All", "Jazz", "Electronic", "Rock", "Classical"].
        │   │       ├── selectedGenre (String): Highlights the active genre button.
        │   │       └── onSelectGenre (Function): Called as onSelectGenre(genre) on button click.
        │   │
        │   └── <AlbumGrid /> ──> src/components/AlbumGrid.jsx (Responsive CSS Grid container)
        │       ├── Props Received:
        │       │   ├── albums (Array<Object>): filteredAlbums from CatalogPage.
        │       │   └── onAddToCart (Function): Forwarded to each AlbumCard.
        │       │
        │       └── <AlbumCard /> ──> src/components/AlbumCard.jsx (Rendered via albums.map() iterator, key = album.id)
        │           ├── Props Received:
        │           │   ├── album (Object): Shows image, title, artist, genre, price.
        │           │   └── onAddToCart (Function): Called as onAddToCart(album) by the "Add to Cart" button.
        │           └── Navigation: <Link to={`/album/${album.id}`}> wraps the image/title (client-side, no reload).
        │
        ├── <Route path="/album/:albumId" element={<AlbumDetailPage />} /> ──> src/pages/AlbumDetailPage.jsx   [ROUTED PAGE]
        │   ├── Route Parameters: const { albumId } = useParams(); album = albums.find(a => a.id === albumId).
        │   ├── Props Received:
        │   │   ├── albums (Array<Object>): The ALBUMS dataset, used to look up the album by albumId.
        │   │   └── onAddToCart (Function): Called as onAddToCart(album) by the "Add to Cart" button.
        │   ├── Renders: image, title, artist, label, description, price, stock status (In Stock / Low Stock),
        │   │     specs (weight, catalogNumber, speed), and tracklist. Shows a "not found" message if no match.
        │   └── Navigation: <Link to="/"> "Back to Catalog" (client-side, no reload).
        │
        └── <Route path="/checkout" element={<CheckoutPage />} /> ──> src/pages/CheckoutPage.jsx   [ROUTED PAGE]
            ├── Owned State (useState):
            │   ├── formData (Object): Controlled input values { fullName: String, address: String, city: String,
            │   │     postalCode: String, cardNumber: String }. Default: all "".
            │   ├── errors (Object): Validation messages keyed by field name, e.g. { postalCode: "Required" }. Default: {}.
            │   └── isOrderSubmitted (Boolean): Swaps the form for the OrderConfirmation view. Default: false.
            ├── Props Received:
            │   ├── cart (Array<{ album, quantity }>): Rendered in the OrderSummary.
            │   ├── subtotal (Number): Order total displayed in the OrderSummary.
            │   └── onClearCart (Function): Called after valid submission to reset the cart in App.
            ├── Callback Handlers:
            │   ├── handleInputChange(event: ChangeEvent): setFormData({ ...formData, [event.target.name]: event.target.value }).
            │   └── handleSubmit(event: FormEvent): event.preventDefault(); validates fields into errors; if valid,
            │         calls onClearCart() and setIsOrderSubmitted(true).
            │
            ├── <OrderSummary /> ──> src/components/OrderSummary.jsx (Itemized order review)
            │   └── Props Received:
            │       ├── cart (Array<{ album, quantity }>): Line items with quantity and line totals.
            │       └── subtotal (Number): Order total.
            │
            ├── <CheckoutForm /> ──> src/components/CheckoutForm.jsx (Controlled form; shown while isOrderSubmitted is false)
            │   └── Props Received:
            │       ├── formData (Object): Supplies each input's value attribute.
            │       ├── errors (Object): Shows an error message under each invalid field.
            │       ├── onChange (Function): Receives handleInputChange; bound to every input's onChange.
            │       └── onSubmit (Function): Receives handleSubmit; bound to the <form> onSubmit.
            │
            └── <OrderConfirmation /> ──> src/components/OrderConfirmation.jsx (Shown once isOrderSubmitted is true)
                ├── Props Received:
                │   └── customerName (String): formData.fullName, used in the thank-you message.
                └── Navigation: <Link to="/"> "Continue Shopping" (client-side, no reload).
```
