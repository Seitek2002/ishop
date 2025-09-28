import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IModificator, IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

import close from './close.svg';
import minus from 'assets/icons/Busket/minus.svg';
import plus from 'assets/icons/Busket/plus.svg';
import whiteMinus from 'assets/icons/CatalogCard/white-minus.svg';
import whitePlus from 'assets/icons/CatalogCard/white-plus.svg';

import '../Cards/style.scss';

import { useGesture } from '@use-gesture/react';
import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IProduct;
  setIsShow: () => void;
  isShow: boolean;
}

const FoodDetail: FC<IProps> = ({ setIsShow, item, isShow }) => {
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();
  const [counter, setCounter] = useState(1);
  const sizes: IModificator[] = item.modificators || [];
  const [selectedSize, setSelectedSize] = useState<IModificator | null>(null);
  const dispatch = useAppDispatch();

  const VibrationClick = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const handleCounterChange = useCallback((delta: number) => {
    setCounter((prev) => Math.max(1, prev + delta));
  }, []);

  const handleDone = useCallback(() => {
    if (item) {
      const sizeId = selectedSize?.id ?? 0;
      const newItem = {
        ...item,
        // Ensure required cart shape: always provide a single category
        category: item.category ??
          item.categories?.[0] ?? { id: 0, categoryName: '' },
        modificators: selectedSize ?? undefined,
        id: item.id + ',' + sizeId,
        quantity: counter,
      };
      dispatch(addToCart(newItem));
    }

    setIsShow();
  }, [item, setIsShow, selectedSize, counter, dispatch]);

  const selectSize = useCallback(
    (sizeKey: IModificator) => {
      setSelectedSize(sizeKey);
      VibrationClick();
    },
    [VibrationClick]
  );

  const bind = useGesture({
    onDrag: ({ movement: [, y], down }) => {
      if (!down && y > 100) {
        setIsShow();
      }
    },
  });

  const handleImageClick = () => {
    setIsShow();
    VibrationClick();
  };

  const foundCartItem = cart.find(
    (cartItem) => +cartItem.id.split(",")[0] == item.id
  );

  const handleAddNoMods = useCallback(() => {
    const newItem = {
      ...item,
      // Ensure cart item always has a single category (fallback to first categories[] or empty)
      category: item.category ?? item.categories?.[0] ?? { id: 0, categoryName: '' },
      id: String(item.id),
      modificators: undefined,
      quantity: 1,
    };
    dispatch(addToCart(newItem));
  }, [dispatch, item]);

  const handleDecrementNoMods = useCallback(() => {
    dispatch(incrementFromCart(item));
  }, [dispatch, item]);

  useEffect(() => {
    if (Array.isArray(item.modificators) && item.modificators[0]) {
      setSelectedSize(item.modificators[0]);
      const curId = item.id + ',' + (item.modificators[0]?.id ?? 0);
      const found = cart.find((cartItem) => cartItem.id === curId);
      if (found) {
        setCounter(found.quantity || 1);
      }
    }
  }, [item.modificators]);

  useEffect(() => {
    const curId = item.id + ',' + (selectedSize?.id ?? 0);
    const found = cart.find((cartItem) => cartItem.id === curId);
    if (found) {
      setCounter(found.quantity || 1);
    } else {
      setCounter(1);
    }
  }, [cart, item.id, selectedSize?.id]);

  useEffect(() => {
    setIsLoaded(false);
  }, [item?.productPhoto]);

  const descriptionNodes = useMemo(() => {
    const desc = item?.productDescription ?? '';
    const trimmed = desc.trim();
    if (!trimmed) return null;

    const lines = trimmed
      .split(/\r\n|\n|\r/)
      .map((l) => l.trim())
      .filter(Boolean);

    const nodes: JSX.Element[] = [];
    let list: string[] = [];

    const pushList = () => {
      if (list.length) {
        nodes.push(
          <ul key={`ul-${nodes.length}`} className='desc-list'>
            {list.map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </ul>
        );
        list = [];
      }
    };

    for (const line of lines) {
      if (/^-/.test(line)) {
        const text = line.replace(/^-\s*/, '').trim();
        if (text) list.push(text);
      } else {
        pushList();
        nodes.push(<p key={`p-${nodes.length}`}>{line}</p>);
      }
    }

    pushList();
    return nodes;
  }, [item?.productDescription]);

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={handleImageClick}
      ></div>
      <div
        className={`${isShow ? 'active' : ''} food-detail`}
        style={{ backgroundColor: '#fff' }}
      >
        <img
          src={close}
          alt='close'
          className='close'
          onClick={handleImageClick}
        />
        <div className='food-detail__wrapper'>
          <div {...bind()} className='img-wrapper'>
            {!isLoaded && (
              <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
            )}
            <img
              src={item?.productPhotoLarge}
              alt='product'
              onLoad={() => setIsLoaded(true)}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <div className='food-detail__content'>
            <div className='description'>
              <h2>{item?.productName}</h2>
              <div className='product-description'>{descriptionNodes}</div>
            </div>
            {sizes.length !== 0 && (
              <div className='size'>
                <div className='flex items-center justify-between'>
                  <h2>{t('size.size')}</h2>
                  <div style={{ color: colorTheme }} className='required'>
                    {t('necessarily')}
                  </div>
                </div>
                <div className='size__content'>
                  {sizes.map((sizeKey: IModificator, index: number) => (
                    <div
                      key={index}
                      className={`size__item bg-white ${
                        selectedSize?.name === sizeKey.name ? 'active' : ''
                      }`}
                      style={{
                        borderColor:
                          selectedSize?.name === sizeKey.name ? colorTheme : '',
                      }}
                      onClick={() => selectSize(sizeKey)}
                    >
                      <span>{sizeKey.name}</span>
                      <div className='price'>{sizeKey.price} c</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sizes.length !== 0 ? (
              <footer className='counter'>
                <div className='counter__left'>
                  <img
                    src={minus}
                    alt=''
                    onClick={() => handleCounterChange(-1)}
                    className='cursor-pointer'
                  />
                  <span>{counter}</span>
                  <img
                    src={plus}
                    alt=''
                    onClick={() => handleCounterChange(1)}
                    className='cursor-pointer'
                  />
                </div>
                <div
                  className='counter__right'
                  style={{ backgroundColor: colorTheme, color: '#fff' }}
                >
                  <button onClick={handleDone}>{t('button.add')}</button>
                </div>
              </footer>
            ) : (
              <div className='food-detail__actions'>
                {!foundCartItem ? (
                  <button
                    className='cart-btn bg-[#F1F2F3] text-[#000]'
                    onClick={handleAddNoMods}
                  >
                    {t('button.add')}
                  </button>
                ) : foundCartItem.modificators && foundCartItem.modificators.name ? (
                  <button
                    className='cart-btn bg-[#F1F2F3] text-[#000]'
                    onClick={handleAddNoMods}
                  >
                    {t('button.add')}
                  </button>
                ) : (
                  <div
                    className='cart-btn active'
                    style={{ backgroundColor: colorTheme }}
                  >
                    <img onClick={handleDecrementNoMods} src={whiteMinus} alt='minus' />
                    <span className='cart-count text-[#fff]'>
                      {foundCartItem?.quantity}
                    </span>
                    <img onClick={handleAddNoMods} src={whitePlus} alt='plus' />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodDetail;
