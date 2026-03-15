'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { IModificator, IProduct, CartItem } from '@/shared/api/types';
import { ProductDescription } from './ProductDescription';
import { ProductFooter } from './ProductFooter';
import { ProductImage } from './ProductImage';
import { ProductModifiers } from './ProductModifiers';

interface FoodDetailModalProps {
  item: IProduct | null;
  isShow: boolean;
  onClose: () => void;
  colorTheme?: string;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  isShow,
  onClose,
  colorTheme = '#854C9D',
}) => {
  const router = useRouter();
  const params = useParams(); // Достаем locale и venue из URL
  const cart = useShopStore((state) => state.cart);
  const addToCart = useShopStore((state) => state.addToCart);
  const decrementQuantity = useShopStore((state) => state.decrementQuantity);

  const [counter, setCounter] = useState(1);
  const [selectedSize, setSelectedSize] = useState<IModificator | null>(null);
  const startY = useRef<number | null>(null);

  const sizes: IModificator[] = item?.modificators || [];

  const [prevItemId, setPrevItemId] = useState<string | number | undefined>(
    undefined,
  );
  if (item?.id !== prevItemId) {
    setPrevItemId(item?.id);
    const defaultSize = item?.modificators?.[0] || null;
    setSelectedSize(defaultSize);

    const curId = item?.id + (defaultSize ? ',' + defaultSize.id : '');
    const found = cart.find((c) => c.id === curId);
    setCounter(found ? found.quantity : 1);
  }

  // Считаем общую сумму корзины для кнопки
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, cartItem) => {
      const price = cartItem.modificators?.price || cartItem.productPrice;
      return sum + price * cartItem.quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = isShow ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isShow]);

  useEffect(() => {
    if (!isShow) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isShow, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches?.[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    if ((e.changedTouches?.[0]?.clientY ?? 0) - startY.current > 100) onClose();
    startY.current = null;
  };

  const handleCounterChange = useCallback((delta: number) => {
    vibrateClick();
    setCounter((prev) => Math.max(1, prev + delta));
  }, []);

  const handleSizeSelect = (sizeKey: IModificator) => {
    vibrateClick();
    setSelectedSize(sizeKey);
    const found = cart.find((c) => c.id === item?.id + ',' + sizeKey.id);
    setCounter(found ? found.quantity : 1);
  };

  const handleAddToCart = useCallback(
    (hasMods: boolean) => {
      vibrateClick();
      if (!item) return;

      const sizeId = hasMods ? (selectedSize?.id ?? 0) : '';
      const baseId = String(item.id);

      const currentTotal = cart
        .filter((ci) => String(ci.id).split(',')[0] === baseId)
        .reduce((sum, ci) => sum + ci.quantity, 0);
      const maxAvail = Number.isFinite(item.quantity)
        ? item.quantity
        : Infinity;
      const remaining = Math.max(0, maxAvail - currentTotal);

      if (remaining <= 0) return;

      const restItem = { ...item };
      delete restItem.modificators;

      const newItem: CartItem = {
        ...restItem,
        id: hasMods ? `${item.id},${sizeId}` : String(item.id),
        modificators: hasMods && selectedSize ? selectedSize : undefined,
        quantity: hasMods ? Math.min(counter, remaining) : 1,
        availableQuantity: item.quantity,
      };

      addToCart(newItem);
      if (hasMods) onClose();
    },
    [item, selectedSize, counter, cart, addToCart, onClose],
  );

  const goToCart = () => {
    vibrateClick();
    onClose();
    // Переход по правильному URL Next.js
    router.push(`/${params.locale}/${params.venue}/cart`);
  };

  if (!item) return null;

  const foundCartItemNoMods = cart.find(
    (c) => c.id === String(item.id) && !c.modificators,
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity duration-300 ${isShow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`fixed left-1/2 top-[55%] md:top-1/2 z-101 w-full md:w-150 h-[90dvh] md:h-auto md:max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isShow ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
        role='dialog'
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-900 shadow-sm'
        >
          <X size={20} />
        </button>

        <div className='overflow-y-auto flex-1 pb-4'>
          <ProductImage
            src={
              item.productPhotoLarge ||
              item.productPhoto ||
              '/assets/images/default-product.svg'
            }
            alt={item.productName}
          />

          <div className='p-5 pb-0'>
            <ProductDescription
              name={item.productName}
              description={item.productDescription}
            />
            <ProductModifiers
              sizes={sizes}
              selectedSize={selectedSize}
              colorTheme={colorTheme}
              onSelect={handleSizeSelect}
            />
          </div>
        </div>

        {/* Обёртка для футера и кнопки перехода в корзину */}
        <div className='bg-white px-5 pb-6 md:pb-5 pt-2 flex flex-col gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10 relative'>
          <ProductFooter
            sizes={sizes}
            counter={counter}
            price={item.productPrice}
            foundCartItemNoMods={foundCartItemNoMods}
            colorTheme={colorTheme}
            onCounterChange={handleCounterChange}
            onAddWithMods={() => handleAddToCart(true)}
            onAddNoMods={() => handleAddToCart(false)}
            onDecrementNoMods={() => {
              vibrateClick();
              decrementQuantity(String(item.id));
            }}
          />

          {/* Кнопка "Перейти в корзину" (появляется только если в корзине что-то есть) */}
          {cartTotal > 0 && (
            <button
              onClick={goToCart}
              className='w-full py-3.5 rounded-xl text-white font-semibold text-[15px] flex items-center justify-between px-5 transition-transform active:scale-[0.98]'
              style={{ backgroundColor: colorTheme }}
            >
              <div className='flex items-center gap-2'>
                <ShoppingBag size={18} />
                <span>Перейти в корзину</span>
              </div>
              <span>{cartTotal} с</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
