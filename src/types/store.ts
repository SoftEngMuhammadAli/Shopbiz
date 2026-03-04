export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
};

export type CheckoutPayload = {
  items: Array<{ productId: string; quantity: number }>;
  shipping: {
    name: string;
    email: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  paymentMethod: "COD" | "STRIPE";
};

