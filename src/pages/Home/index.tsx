import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { loadUsersDataFromStorage } from 'utils/storageUtils';
import Adaptivement from './components/Adaptivement';
import Catalog from './components/Catalog';
import Categories from './components/Categories';
import ClearCartModal from 'components/ClearCartModal';
import Hero from 'components/Hero';
import Header from 'src/components/Header';

const Home = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [active, setActive] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const catalogRef = useRef<HTMLDivElement>(null);
  const [search, onSearch] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const userData = loadUsersDataFromStorage();
  const [categoryTitle, setCategoryTitle] = useState<string>(t('allDishes'));
  const clearCartHandler = () => {
    setActive(!active);
  };

  const onSearchChange = (bool: boolean) => {
    onSearch(bool);
    document.body.style.overflow = bool ? 'hidden' : '';
    window.scrollTo(0, 0);
    if (!bool) {
      setSelectedCategory(0);
      setCategoryTitle(t('allDishes'));
    }
  };

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    catalogRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('mainPage', location.pathname);

    localStorage.setItem(
      'users',
      JSON.stringify({
        ...userData,
        activeSpot: +location.pathname.split('/').filter((item) => +item)[0],
      })
    );
  }, [location.pathname, userData]);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(h);
  }, [searchText]);

  return (
    <div className='relative font-inter bg-[#F1F2F3] px-[16px] pt-[12px] lg:max-w-[1140px] lg:mx-auto'>
      <ClearCartModal isShow={active} setActive={setActive} />
      <Header searchText={searchText} setSearchText={setSearchText} />
      <div className='flex gap-[30px] items-start pb-[50px] w-full'>
        <div className='w-full md:w-[58%]'>
          <Hero />
          <Categories
            onCategoryChange={handleCategoryChange}
            onSearchChange={onSearchChange}
            selectedCategory={selectedCategory ?? 0}
            onCategoryTitleChange={(title) => setCategoryTitle(title)}
          />
          <div ref={catalogRef} className='md:pb-[100px]'>
            <Catalog
              searchText={debouncedSearchText}
              selectedCategory={selectedCategory}
              categoryTitle={categoryTitle}
              isSearchOpenOnMobile={search}
            />
          </div>
        </div>
        <Adaptivement
          clearCartHandler={clearCartHandler}
          search={search}
          setSearchText={setSearchText}
          searchText={searchText}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default Home;
