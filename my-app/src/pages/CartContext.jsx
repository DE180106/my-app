import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext();

const initialState = () => {
  try { return JSON.parse(localStorage.getItem("cart")) || { items: [] }; }
  catch { return { items: [] }; }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find(i => i.id === action.item.id);
      const items = exists
        ? state.items.map(i => (i.id === action.item.id ? { ...i, qty: i.qty + (action.qty || 1) } : i))
        : [...state.items, { ...action.item, qty: action.qty || 1 }];
      return { items };
    }
    case "INC": return { items: state.items.map(i => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i)) };
    case "DEC": return { items: state.items.map(i => (i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)) };
    case "REMOVE": return { items: state.items.filter(i => i.id !== action.id) };
    case "CLEAR": return { items: [] };
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(state)); }, [state]);

  const subtotal = useMemo(() => state.items.reduce((s, i) => s + i.price * i.qty, 0), [state.items]);
  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  const value = {
    items: state.items,
    subtotal, shipping, total,
    add: (item, qty) => dispatch({ type: "ADD", item, qty }),
    inc: id => dispatch({ type: "INC", id }),
    dec: id => dispatch({ type: "DEC", id }),
    remove: id => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
export const format = n => n.toLocaleString("vi-VN") + "₫";
