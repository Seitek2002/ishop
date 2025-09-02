import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { usePostOrdersMutation } from 'api/Orders.api';
import { useGetProductsQuery } from 'api/Products.api';
import { IReqCreateOrder } from 'types/orders.types';
import { IFoodCart, IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { loadUsersDataFromStorage } from 'utils/storageUtils';
import { getTodayScheduleWindow, isOutsideWorkTime } from 'utils/timeUtils';
import Empty from './components/Empty';
import BusketDesktop from 'components/BusketDesktop';
import BusketCard from 'components/Cards/Cart';
import CatalogCard from 'components/Cards/Catalog';
import CartLoader from 'components/CartLoader';
import ClearCartModal from 'components/ClearCartModal';
import FoodDetail from 'components/FoodDetail';
import WorkTimeModal from 'components/WorkTimeModal';

import clearCartIcon from 'assets/icons/Busket/clear-cart.svg';
import cookie from 'assets/icons/Busket/cookie.svg';
import headerArrowIcon from 'assets/icons/Busket/header-arrow.svg';
import priceArrow from 'assets/icons/Busket/price-arrow.svg';

import './style.scss';

import { useMask } from '@react-input/mask';
import { clearCart, setUsersData } from 'src/store/yourFeatureSlice';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const [postOrder] = usePostOrdersMutation();
  const userData = loadUsersDataFromStorage();
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const [isLoading, setIsLoading] = useState(false);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const venueData = useAppSelector((state) => state.yourFeature.venue);

  const [activeIndex, setActiveIndex] = useState(0);
  const defaultSpotId =
    venueData?.defaultDeliverySpot ?? venueData?.spots?.[0]?.id ?? 0;
  const [selectedSpot, setSelectedSpot] = useState(defaultSpotId);

  const [phoneNumber, setPhoneNumber] = useState(
    `+996${userData.phoneNumber.replace('996', '')}`
  );
  const [comment, setComment] = useState('');
  const [address, setAddress] = useState(userData.address || '');
  const [promoCode, setPromoCode] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [activeFood, setActiveFood] = useState<IProduct | null>(null);
  const [active, setActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [clearCartModal, setClearCartModal] = useState(false);
  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);

  const navigate = useNavigate();
  const { data } = useGetProductsQuery({
    organizationSlug: venueData.slug,
    spotId: selectedSpot,
  });

  // console.log(data);

  const inputRef = useMask({
    mask: '+996_________',
    replacement: { _: /\d/ },
  });

  const orderTypes = useMemo(
    () => [{ text: t('empty.delivery'), value: 3 }],
    [t]
  );

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleClose = () => {
    setIsShow(false);
    document.body.style.height = '';
    document.body.style.overflow = '';
  };

  const handleOpen = (food: IProduct) => {
    setIsShow(true);
    setActiveFood(food);
    document.body.style.height = '100dvh';
    document.body.style.overflow = 'hidden';
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);

    if (!value.trim()) {
      setPhoneError('Это обязательное поле');
    } else if (value.length < 13) {
      setPhoneError('Тут нужно минимум 12 символов');
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);

    if (!value.trim()) {
      setAddressError('Это обязательное поле');
    } else if (value.trim().length < 4) {
      setAddressError('Тут нужно минимум 4 символа');
    } else {
      setAddressError('');
    }
  };

  const validateForm = () => {
    let hasError = false;

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 12) {
      setPhoneError('Тут нужно минимум 12 символов');
      hasError = true;
      const el = document.getElementById('phoneNumber');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setPhoneError('');
    }

    const isDelivery = orderTypes[activeIndex]?.value === 3;
    if (isDelivery) {
      if (!address.trim() || address.trim().length < 4) {
        setAddressError('Тут нужно минимум 4 символа');
        hasError = true;
        const el = document.getElementById('address');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setAddressError('');
      }
    }

    return !hasError;
  };

  const handleOrder = async () => {
    // Validate before proceeding; show inline errors and keep button enabled
    if (!validateForm()) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      return;
    }

    setIsLoading(true);

    // Block ordering outside working hours (weekly schedules aware)
    const { window: todayWindow, isClosed } = getTodayScheduleWindow(
      venueData?.schedules,
      venueData?.schedule
    );
    if (isClosed || isOutsideWorkTime(todayWindow)) {
      setShowWorkTimeModal(true);
      setIsLoading(false);
      return;
    }

    console.log('Promo code:', promoCode);
    const orderProducts = cart.map((item) => {
      if (item.modificators?.id) {
        return {
          product: +item.id.split(',')[0],
          count: +item.quantity,
          modificator: item.modificators.id,
        };
      } else {
        return {
          product: +item.id.split(',')[0],
          count: +item.quantity,
        };
      }
    });

    const currentType = orderTypes[activeIndex];
    if (!currentType) {
      setIsLoading(false);
      return;
    }

    const acc: IReqCreateOrder = {
      phone: phoneNumber
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
        .replace(' ', '')
        .replace('+', '')
        .replace(' ', ''),
      orderProducts,
      comment,
      serviceMode: 1,
      address: '',
      spot: selectedSpot,
    };

    if (venueData?.table?.tableNum) {
      acc.serviceMode = 1;
    } else {
      if (currentType.value === 3) {
        acc.serviceMode = 3;
        acc.address = address;
      } else {
        acc.serviceMode = currentType.value;
      }
    }

    dispatch(
      setUsersData({
        ...userData,
        phoneNumber: acc.phone,
        address,
        type: currentType.value,
        activeSpot: selectedSpot,
      })
    );

    const { data: res } = await postOrder({
      ...acc,
      spot: selectedSpot,
    });

    if (res?.paymentUrl) {
      window.location.href = res.paymentUrl;
      dispatch(clearCart());
    } else {
      setIsLoading(false);
    }
  };

  function getCartItemPrice(item: IFoodCart): number {
    if (item.modificators?.price) {
      return item.modificators.price;
    }
    return item.productPrice;
  }

  const subtotal = cart.reduce((acc, item) => {
    const realPrice = getCartItemPrice(item);
    return acc + realPrice * item.quantity;
  }, 0);
  const serviceFeeAmt = subtotal * (venueData.serviceFeePercent / 100);
  const isDeliveryType = orderTypes[activeIndex]?.value === 3;
  const deliveryFreeFrom =
    venueData?.deliveryFreeFrom != null
      ? Number(venueData.deliveryFreeFrom)
      : null;
  const deliveryFixedFee = Number(venueData?.deliveryFixedFee || 0);
  const deliveryFee = isDeliveryType
    ? deliveryFreeFrom !== null && subtotal >= deliveryFreeFrom
      ? 0
      : deliveryFixedFee
    : 0;
  const hasFreeDeliveryHint =
    isDeliveryType && deliveryFreeFrom !== null && subtotal < deliveryFreeFrom;
  const total =
    Math.round((subtotal + serviceFeeAmt + deliveryFee) * 100) / 100;

  // Smooth auto-height for details dropdown (no hardcoded px)
  useEffect(() => {
    if (active) {
      const h = wrapperRef.current?.scrollHeight ?? 0;
      setWrapperHeight(h);
    } else {
      setWrapperHeight(0);
    }
    // Recompute when content that affects height changes
  }, [active, subtotal, serviceFeeAmt, deliveryFee, hasFreeDeliveryHint]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (userData.type) {
      const idx = orderTypes.findIndex((it) => it.value === userData.type);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [userData.type, orderTypes]);

  return (
    <>
      <section className='cart relative font-inter bg-[#F1F2F3] px-[16px] pt-[40px] lg:max-w-[1140px] lg:mx-auto'>
        <FoodDetail
          isShow={isShow}
          setIsShow={handleClose}
          item={
            activeFood || {
              category: { categoryName: '', id: 0 },
              productName: '',
              productPhoto: '',
              productPrice: 0,
              productPhotoLarge: '',
              productPhotoSmall: '',
              weight: 0,
              productDescription: '',
              isRecommended: false,
              modificators: [{ id: 0, name: '', price: 0 }],
              id: 0,
            }
          }
        />
        <ClearCartModal isShow={clearCartModal} setActive={setClearCartModal} />
        <WorkTimeModal
          isShow={showWorkTimeModal}
          onClose={() => setShowWorkTimeModal(false)}
        />
        {isLoading && <CartLoader />}

        <header className='cart__header'>
          <img
            src={headerArrowIcon}
            alt=''
            onClick={() => navigate(-1)}
            className='cursor-pointer'
          />
          <h3>{t('basket.title')}</h3>
          <img
            src={clearCartIcon}
            alt=''
            onClick={() => setClearCartModal(true)}
          />
        </header>

        {window.innerWidth < 768 && (
          <>
            {venueData?.table?.tableNum && (
              <div className='cart__top'>
                {t('table')}
                {venueData.table.tableNum}
              </div>
            )}
            <div className='cart__items'>
              {cart.length > 0 ? (
                cart.map((item) => <BusketCard key={item.id} item={item} />)
              ) : (
                <div />
              )}
            </div>
          </>
        )}

        <div className='md:flex gap-[24px]'>
          <div className='md:w-[50%]'>
            {cart.length > 0 ? (
              <>
                {!venueData?.table?.tableNum && (
                  <div className='cart__order-type'>
                    {orderTypes.length !== 1 && (
                      <>
                        {orderTypes.map((item, idx) => (
                          <div
                            key={item.value}
                            onClick={() => handleClick(idx)}
                            className={`cart__order-type-wrapper bg-[#fff] border-[#e1e2e5] cursor-pointer justify-center ${
                              activeIndex === idx ? 'active' : ''
                            }`}
                            style={{
                              borderColor:
                                activeIndex === idx ? colorTheme : '#e1e2e5',
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {venueData.spots?.length !== 1 && (
                  <>
                    {activeIndex === 0 && (
                      <div className='cart__contacts'>
                        <div className='flex items-center justify-between mb-6'>
                          <h4>{t('selectBranch')}</h4>
                        </div>

                        <div className='space-y-4'>
                          {venueData.spots?.map((location) => {
                            const isSelected = selectedSpot === location.id;

                            return (
                              <label
                                key={location.id}
                                style={{
                                  borderColor:
                                    isSelected && colorTheme
                                      ? colorTheme
                                      : '#e1e2e5',
                                }}
                                className={`
                              flex items-center w-full px-1 rounded-xl cursor-pointer transition-all duration-200
                              border-[2px]
                            `}
                                htmlFor={location.id + ''}
                              >
                                <div className='relative mr-4 flex-shrink-0'>
                                  <input
                                    type='radio'
                                    id={location.id + ''}
                                    name='location'
                                    checked={isSelected}
                                    onChange={() =>
                                      setSelectedSpot(location.id)
                                    }
                                    className='peer sr-only'
                                  />
                                  <div
                                    style={{ backgroundColor: colorTheme }}
                                    className={`
                                w-5 h-5 rounded-full border-2 transition-colors duration-200
                                ${
                                  isSelected
                                    ? 'border-amber-600 bg-amber-600'
                                    : 'border-amber-400 bg-white peer-hover:border-amber-500'
                                }
                              `}
                                  >
                                    {isSelected && (
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className='w-2 h-2 rounded-full bg-white' />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div style={{ color: colorTheme }}>
                                  <div className='font-medium'>
                                    {location.name}
                                  </div>
                                  <div className=''>{location.address}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className='cart__contacts'>
                  <div className='flex items-center justify-between mb-[12px]'>
                    <h4>{t('empty.contact')}</h4>
                  </div>

                  <label htmlFor='phoneNumber'>
                    <span className='text-[14px]'>
                      {t('phoneNumber')}{' '}
                      <span className='required' style={{ color: colorTheme }}>
                        {t('necessarily')}
                      </span>
                    </span>
                    <input
                      type='text'
                      placeholder='+996'
                      id='phoneNumber'
                      ref={inputRef}
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                    {phoneError && (
                      <div className='error-message'>{phoneError}</div>
                    )}
                  </label>

                  {
                    <>
                      {orderTypes[activeIndex]?.value === 3 && (
                        <label htmlFor='address'>
                          <span className='text-[14px]'>{t('addres')}</span>
                          <input
                            type='text'
                            id='address'
                            placeholder={t('empty.location') || t('addres')}
                            value={address}
                            onChange={(e) =>
                              handleAddressChange(e.target.value)
                            }
                          />
                          {addressError && (
                            <div className='error-message'>{addressError}</div>
                          )}
                        </label>
                      )}
                    </>
                  }

                  {!showCommentInput ? (
                    <button
                      type='button'
                      className='text-[14px] block underline mb-3'
                      style={{ color: colorTheme }}
                      onClick={() => setShowCommentInput(true)}
                    >
                      {t('addComment')}
                    </button>
                  ) : (
                    <label htmlFor='comment'>
                      <span className='text-[14px]'>{t('comment')}</span>
                      <input
                        id='comment'
                        type='text'
                        placeholder={t('empty.comment') || t('comment')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                  )}
                </div>

                <div className='cart__promo bg-[#fff] p-[12px] rounded-[12px] mt-[12px]'>
                  <label htmlFor='promoCode' className='block'>
                    <span className='text-[14px] block mb-[8px]'>
                      {t('promoCode')}
                    </span>
                    <input
                      id='promoCode'
                      type='text'
                      placeholder={t('promoCode')}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </label>
                </div>

                <div className='cart__sum bg-[#fff]'>
                  <div
                    onClick={() => setActive(!active)}
                    className='cart__sum-top text-[#80868B]'
                  >
                    {t('empty.deteil')}
                    <img
                      src={priceArrow}
                      alt='arrow'
                      className={
                        active ? 'cart__sum-img active' : 'cart__sum-img'
                      }
                    />
                  </div>
                  <div
                    ref={wrapperRef}
                    className={
                      active
                        ? 'cart__sum-wrapper divide-y active'
                        : 'cart__sum-wrapper divide-y'
                    }
                    style={{ height: `${wrapperHeight}px` }}
                  >
                    <div className='cart__sum-item text-[#80868B]'>
                      {t('empty.total')}
                      <div className='cart__sum-total all text-[#80868B]'>
                        {subtotal} c
                      </div>
                    </div>
                    <div className='cart__sum-item text-[#80868B]'>
                      {t('services')}
                      <div className='cart__sum-total service'>
                        {venueData.serviceFeePercent}%
                      </div>
                    </div>
                    <div className='cart__sum-item text-[#80868B]'>
                      {t('deliveryFee')}
                      <div className='cart__sum-total delivery'>
                        {deliveryFee} c
                      </div>
                    </div>
                    {hasFreeDeliveryHint && (
                      <div className='cart__sum-item text-[#80868B]'>
                        <span className=''>{t('freeDeliveryFrom')}</span>
                        <div className='cart__sum-total text-[#00BFB2] font-semibold'>
                          {Number(deliveryFreeFrom)} c
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='cart__sum-ress border-[#f3f3f3]'>
                    {t('empty.totalAmount')} <span>{total} c</span>
                  </div>
                </div>
              </>
            ) : (
              <Empty />
            )}
          </div>

          {window.innerWidth >= 768 && (
            <div className='busket flex-1'>
              <BusketDesktop
                to='/order'
                createOrder={handleOrder}
                disabled={!cart.length}
              />
            </div>
          )}
        </div>

        {(data?.filter((item) => item.isRecommended) ?? []).length > 0 && (
          <div className='cart__forgot'>
            <h4 className='cart__forgot-title'>
              {t('orders.forgotten')}
              <img src={cookie} alt='cookie' />
            </h4>
            <div className='cart__forgot-wrapper'>
              {data
                ?.filter((item) => item.isRecommended)
                .map((item) => (
                  <CatalogCard
                    foodDetail={handleOpen}
                    key={item.id}
                    item={item}
                  />
                ))}
            </div>
          </div>
        )}

        {window.innerWidth < 768 && (
          <footer className='cart__footer'>
            <button
              disabled={!cart.length}
              style={{ backgroundColor: colorTheme }}
              onClick={handleOrder}
            >
              {t('button.next') || 'Далее'}
            </button>
          </footer>
        )}
      </section>
    </>
  );
};

export default Cart;
