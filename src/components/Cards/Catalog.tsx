import { FC, useMemo, useState } from 'react';

import { IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

import defaultProduct from 'assets/images/default-product.svg';

import './style.scss';

import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IProduct;
  foodDetail?: (item: IProduct) => void;
}

const CatalogCard: FC<IProps> = ({ item, foodDetail }) => {
  const dispatch = useAppDispatch();

  const srcCandidate = useMemo(
    () =>
      item.productPhoto ||
      item.productPhotoLarge ||
      item.productPhotoSmall ||
      defaultProduct,
    [item.productPhoto, item.productPhotoLarge, item.productPhotoSmall]
  );
  const [isLoaded, setIsLoaded] = useState(srcCandidate === defaultProduct);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const openFoodDetail = () => {
    if (foodDetail) foodDetail(item as IProduct);
  };

  const handleClick = () => {
    if (item.modificators.length) {
      openFoodDetail();
    } else {
      const newItem = {
        ...item,
        // Ensure cart item always has a single category (fallback to first categories[] or empty)
        category: item.category ??
          item.categories?.[0] ?? { id: 0, categoryName: '' },
        id: item.id + '',
        modificators: undefined,
        quantity: 1,
      };
      dispatch(addToCart(newItem));
    }
  };
  const handleDecrement = () => {
    if (item.modificators.length) {
      openFoodDetail();
    } else {
      dispatch(incrementFromCart(item));
    }
  };

  const foundCartItem = cart.find(
    (cartItem) => +cartItem.id.split(',')[0] == item.id
  );

  return (
    <div className='cart-block bg-white'>
      <div className='cart-img'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <img
          src={srcCandidate}
          alt={item.productName || 'product'}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (e.currentTarget.src !== defaultProduct) {
              e.currentTarget.src = defaultProduct;
              setIsLoaded(true);
            }
          }}
          className={`transition-opacity duration-300 cursor-pointer ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={openFoodDetail}
        />
        <div
          className={
            foundCartItem ? 'add-btn active opacity-90' : 'add-btn opacity-90'
          }
          style={{ backgroundColor: colorTheme }}
        >
          <div className='wrapper-btn'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              className='absolute flex items-center justify-center'
              style={{
                width: foundCartItem?.quantity ? 18 : 0,
                height: 18,
                left: foundCartItem?.quantity ? 0 : 100,
                transition: '0.5s',
                color: '#fff',
                lineHeight: '18px',
              }}
              aria-label='minus'
            >
              -
            </button>
            <span
              className='cart-count text-[#fff] text-center'
              style={{
                transition: '0.5s',
                overflow: 'hidden',
              }}
            >
              {foundCartItem?.quantity}
            </span>
            <div></div>
          </div>
          <div className='absolute right-2 flex justify-center items-center h-full'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              style={{
                height: 18,
                width: 18,
                color: '#fff',
                lineHeight: '18px',
              }}
              className=' z-10 flex items-center justify-center'
              aria-label='plus'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {item.modificators.length ? (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            от {+item.modificators[0].price} с
          </span>
        </div>
      ) : (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            {+item.productPrice} с
          </span>
        </div>
      )}
      <h4 className='cart-name'>{item.productName}</h4>
    </div>
  );
};

export default CatalogCard;
