function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-img" />

      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p className="cart-item-artist">{item.artist}</p>
        <p className="cart-item-price">
          ${item.price.toFixed(2)} each &middot;{" "}
          <strong>${lineTotal.toFixed(2)}</strong>
        </p>

        <div className="qty-controls">
          <button type="button" onClick={() => onUpdateQuantity(item.id, -1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => onUpdateQuantity(item.id, 1)}>
            +
          </button>
          <button
            type="button"
            className="btn-remove"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
