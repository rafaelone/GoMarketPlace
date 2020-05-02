import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const productsStorage = await AsyncStorage.getItem('@GoMarketPlace:cart');

      if (productsStorage) {
        setProducts(JSON.parse(productsStorage));
      } else {
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const findProduct = products.find(
        productIndex => productIndex.id === product.id,
      );

      if (findProduct) {
        findProduct.quantity += 1;
        setProducts([...products]);
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

      const allProducts = [...products];
      const findProduct = allProducts.findIndex(product => product.id === id);

      if (findProduct > -1) {
        allProducts[findProduct].quantity += 1;
        setProducts(allProducts);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const allPRoducts = [...products];
      const findProduct = allPRoducts.findIndex(product => product.id === id);

      if (findProduct > -1) {
        if (allPRoducts[findProduct].quantity === 1) {
          allPRoducts.splice(findProduct, 1);
        } else {
          allPRoducts[findProduct].quantity -= 1;
        }
        setProducts(allPRoducts);
      }
      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
