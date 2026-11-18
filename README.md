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

The project root holds the build and config files (`index.html`, `package.json`, `vite.config.js`) plus this `README.md`. All application code lives in `src/`, where `main.jsx` boots up `App.jsx` and `styles.css` holds the all styles. `src/pages/` contains the different page views (`CatalogPage`, `AlbumDetailPage`, `CheckoutPage`), and `src/components/` contains various UI pieces (`Navbar`, `CartDrawer`, `AlbumCard`, and `CartItem`). `src/data/albums.js` is the given dataset.

---

## 2. React Component Hierarchy & State Flow Architecture

```text
<BrowserRouter> ──> src/main.jsx (Wraps <App /> to enable client-side routing)
│
└── <App /> ──> src/App.jsx (Root component; owns all shared state)
    ├── Owned State (useState):
    │   ├── cart (Array<{ ...album, quantity: Number }>): Line items (each is a copy of the album object plus a
    │   │     quantity field), lifted here so Navbar, CartDrawer, AlbumCard/AlbumDetailPage (adding), and
    │   │     CheckoutPage stay synchronized across routes. Default: [].
    │   └── isCartOpen (Boolean): Controls whether the slide-over CartDrawer is visible. Default: false.
    ├── Derived Values (computed each render, not stored in state):
    │   └── totalCartCount (Number): cart.reduce((sum, item) => sum + item.quantity, 0)
    ├── Callback Handlers Defined & Passed Down (all update state immutably via .map(), .filter(), spread):
    │   ├── handleAddToCart(album: Object, quantity: Number = 1): Adds { ...album, quantity } or increases the
    │   │     quantity if already in cart, then opens the drawer (setIsCartOpen(true)).
    │   ├── handleUpdateQuantity(albumId: String, delta: Number): Adds +1/-1 to quantity; removes the item if it reaches 0.
    │   ├── handleRemoveFromCart(albumId: String): Filters the matching album out of cart.
    │   ├── handleClearCart(): Resets cart to [] after a successful checkout.
    │   ├── () => setIsCartOpen(true): Inline arrow function passed to Navbar as onOpenCart.
    │   └── () => setIsCartOpen(false): Inline arrow function passed to CartDrawer as onClose.
    │
    ├── <Navbar /> ──> src/components/Navbar.jsx (Sticky header; rendered on every route)
    │   ├── Props Received:
    │   │   ├── cartCount (Number): totalCartCount, shown in the cart badge pill (hidden when 0).
    │   │   └── onOpenCart (Function): Called when the "Cart" badge button is clicked.
    │   └── Navigation: <Link to="/"> on the VinylVault logo and the "Catalog" link (client-side, no reload).
    │
    ├── <CartDrawer /> ──> src/components/CartDrawer.jsx (Slide-over panel; rendered on every route)
    │   ├── Props Received:
    │   │   ├── isOpen (Boolean): isCartOpen; when false the drawer renders nothing (returns null), when true it slides in with a CSS animation.
    │   │   ├── cart (Array<{ ...album, quantity }>): Line items to render.
    │   │   ├── onClose (Function): Closes the drawer (✕ button / overlay click).
    │   │   ├── onUpdateQuantity (Function): handleUpdateQuantity, forwarded to each CartItem's +/- buttons.
    │   │   └── onRemove (Function): handleRemoveFromCart, forwarded to each CartItem's Remove button.
    │   ├── Derived Values:
    │   │   └── subtotal (Number): cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    │   ├── Callback Handlers:
    │   │   └── handleProceedToCheckout(): Calls onClose() then navigate("/checkout") from useNavigate().
    │   │
    │   └── <CartItem /> ──> src/components/CartItem.jsx (Rendered via cart.map() iterator, key = item.id)
    │       └── Props Received:
    │           ├── item ({ ...album, quantity: Number }): The line item to display.
    │           ├── onUpdateQuantity (Function): Called as onUpdateQuantity(item.id, +1 | -1).
    │           └── onRemove (Function): Called as onRemove(item.id).
    │           (Line total = item.price * item.quantity, computed inline.)
    │
    └── <Routes> (React Router v6+ route switch; renders exactly one matching <Route>)
        │
        ├── <Route path="/" element={<CatalogPage />} /> ──> src/pages/CatalogPage.jsx   [ROUTED PAGE]
        │   ├── Owned State (useState):
        │   │   └── selectedGenre (String): Active filter: "All" | "Jazz" | "Electronic" | "Rock" | "Classical". Default: "All".
        │   ├── Props Received:
        │   │   ├── albums (Array<Object>): The ALBUMS dataset passed down from App.
        │   │   └── onAddToCart (Function): handleAddToCart from App, forwarded to each AlbumCard.
        │   ├── Local Constants:
        │   │   └── genres (Array<String>): ["All", "Jazz", "Electronic", "Rock", "Classical"].
        │   ├── Derived Values:
        │   │   └── filteredAlbums (Array<Object>): selectedGenre === "All" ? albums : albums.filter(a => a.genre === selectedGenre)
        │   ├── Events:
        │   │   └── Filter button onClick: () => setSelectedGenre(genre).
        │   │
        │   ├── <header className="catalog-hero"> (Inline JSX banner: heading + tagline)
        │   │
        │   ├── <div className="filter-bar"> (Inline controlled button group: genres.map() renders one button per
        │   │     genre; the button matching selectedGenre gets the "active" class)
        │   │
        │   └── <div className="album-grid"> (Inline responsive CSS Grid container)
        │       │
        │       └── <AlbumCard /> ──> src/components/AlbumCard.jsx (Rendered via filteredAlbums.map() iterator, key = album.id)
        │           ├── Props Received:
        │           │   ├── album (Object): Shows image, genre, title, artist, price.
        │           │   └── onAddToCart (Function): Called as onAddToCart(album) by the "Add to Cart" button.
        │           └── Navigation: <Link to={`/album/${album.id}`}> on the image and title (client-side, no reload).
        │
        ├── <Route path="/album/:albumId" element={<AlbumDetailPage />} /> ──> src/pages/AlbumDetailPage.jsx   [ROUTED PAGE]
        │   ├── Route Parameters: const { albumId } = useParams(); album = albums.find(a => a.id === albumId).
        │   ├── Owned State (useState):
        │   │   └── qty (Number): How many copies to add from the quantity input. Default: 1 (never below 1).
        │   ├── Props Received:
        │   │   ├── albums (Array<Object>): The ALBUMS dataset, used to look up the album by albumId.
        │   │   └── onAddToCart (Function): Called as onAddToCart(album, qty) by the "Add {qty} to cart" button.
        │   ├── Events:
        │   │   └── Quantity input onChange: setQty(Math.max(1, parseInt(e.target.value, 10) || 1)).
        │   ├── Renders: image, genre, title, artist, price, description, stock status ("In Stock (N units
        │   │     available)" / "Out of Stock"), specs table (label, catalogNumber, weight, speed), and tracklist.
        │   │     Shows an "Album Not Found" message if no album matches albumId.
        │   └── Navigation: Breadcrumb <Link to="/"> "Catalog" (client-side, no reload).
        │
        └── <Route path="/checkout" element={<CheckoutPage />} /> ──> src/pages/CheckoutPage.jsx   [ROUTED PAGE]
            ├── Owned State (useState):
            │   ├── formData (Object): Controlled input values { fullName: String, address: String, city: String,
            │   │     postalCode: String, cardNumber: String }. Default: all "".
            │   ├── errors (Object): Validation messages keyed by field name, e.g. { postalCode: "Postal code must be
            │   │     5 digits." }. Default: {}.
            │   └── isSubmitted (Boolean): Swaps the form for the order confirmation view. Default: false.
            ├── Props Received:
            │   ├── cart (Array<{ ...album, quantity }>): Rendered in the order summary.
            │   └── onClearCart (Function): handleClearCart from App; called after a valid submission to reset the cart.
            ├── Derived Values:
            │   ├── subtotal (Number): cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            │   ├── taxes (Number): subtotal * 0.06
            │   └── total (Number): subtotal + taxes
            ├── Callback Handlers:
            │   ├── handleChange(e: ChangeEvent): setFormData({ ...formData, [e.target.name]: e.target.value }).
            │   ├── validateForm(): Returns an errors object (required fields, 5-digit postal code, 16-digit card number).
            │   └── handleSubmit(e: FormEvent): e.preventDefault(); runs validateForm() and stores the result in errors;
            │         if there are no errors, calls setIsSubmitted(true) and onClearCart().
            │
            ├── Conditional Views (only one renders, chosen with if statements):
            │   ├── isSubmitted === true -> <div className="checkout-success"> (Inline confirmation: thank-you message
            │   │     with formData.fullName and shipping address, plus <Link to="/"> "Return to HomePage")
            │   ├── cart.length === 0 -> <div className="empty-cart-page"> (Inline empty-cart message with <Link to="/">)
            │   └── otherwise -> checkout layout below
            │
            ├── <form className="checkout-form" onSubmit={handleSubmit}> (Inline controlled form; noValidate so the
            │     React validation messages show instead of the browser's)
            │   ├── Inputs (each has value={formData.<name>} and onChange={handleChange}):
            │   │     fullName, address, city, postalCode, cardNumber
            │   ├── Error text: {errors.<name> && <p className="form-error">} under each input.
            │   └── Submit button: "Complete Order ($total)".
            │
            └── <aside className="order-summary-card"> (Inline itemized order review)
                ├── cart.map() -> one row per item: title × quantity and line total (item.price * item.quantity).
                └── Subtotal, Estimated Tax (6%), and Total rows.
```
