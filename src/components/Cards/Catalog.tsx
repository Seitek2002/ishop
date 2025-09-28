import { FC, useMemo, useState } from 'react';

import { IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

import whiteMinus from 'assets/icons/CatalogCard/white-minus.svg';
import whitePlus from 'assets/icons/CatalogCard/white-plus.svg';
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
        {item.modificators.length ? (
          <div
            className='add-btn'
            style={{ backgroundColor: colorTheme }}
            onClick={openFoodDetail}
          >
            <img
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              src={whitePlus}
              alt='plus'
              style={{ width: 18, height: 18 }}
            />
          </div>
        ) : !foundCartItem ? (
          <div
            className='add-btn'
            style={{ backgroundColor: colorTheme }}
            onClick={handleClick}
          >
            <img
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              src={whitePlus}
              alt='plus'
              style={{ width: 18, height: 18 }}
            />
          </div>
        ) : (
          <div
            className='add-btn active opacity-90'
            style={{ backgroundColor: colorTheme }}
          >
            <img
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              src={whiteMinus}
              alt='minus'
              style={{ width: 18, height: 18 }}
            />
            <span className='cart-count text-[#fff] text-[18px]'>
              {foundCartItem?.quantity}
            </span>
            <img
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              src={whitePlus}
              alt='plus'
              style={{ width: 18, height: 18 }}
            />
          </div>
        )}
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
