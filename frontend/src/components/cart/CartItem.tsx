import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { CartItem as CartItemType } from '@/types/cart';

// Memoized image — never re-renders
const CartItemImage = memo(
  ({ productId, src, alt }: { productId: number; src: string; alt: string }) => (
    <Link href={`/products/${productId}`} className="relative flex-shrink-0 w-24 h-24">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="96px"
        className="object-cover rounded-lg hover:opacity-80 transition"
      />
    </Link>
  )
);
CartItemImage.displayName = 'CartItemImage';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= item.product.stock) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <article className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      <CartItemImage
        productId={item.product.id}
        src={item.product.imageUrl}
        alt={item.product.name}
      />

      <div className="flex-grow">
        <Link
          href={`/products/${item.product.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
        >
          {item.product.name}
        </Link>

        <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <label htmlFor={`qty-${item.id}`} className="text-sm font-medium">
              Quantity:
            </label>
            <input
              id={`qty-${item.id}`}
              type="number"
              min="1"
              max={item.product.stock}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              aria-label={`Quantity for ${item.product.name}`}
            />
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.product.name} from cart`}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm text-gray-600">Unit Price</div>
        <div className="text-lg font-semibold text-gray-900">{formatPrice(item.product.price)}</div>
        <div className="mt-3 text-sm text-gray-600">Total</div>
        <div className="text-xl font-bold text-blue-600">{formatPrice(itemTotal)}</div>
      </div>
    </article>
  );
};

export const CartItem = memo(CartItemComponent, (prev, next) => {
  return (
    prev.item.id === next.item.id &&
    prev.item.quantity === next.item.quantity &&
    prev.onQuantityChange === next.onQuantityChange &&
    prev.onRemove === next.onRemove
  );
});
