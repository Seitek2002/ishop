import { CartItem, IModificator } from '@/shared/api/types';

interface ProductFooterProps {
  sizes: IModificator[];
  counter: number;
  price: number;
  foundCartItemNoMods?: CartItem;
  colorTheme: string;
  onCounterChange: (delta: number) => void;
  onAddWithMods: () => void;
  onAddNoMods: () => void;
  onDecrementNoMods: () => void;
}

export const ProductFooter = ({
  sizes,
  counter,
  price,
  foundCartItemNoMods,
  colorTheme,
  onCounterChange,
  onAddWithMods,
  onAddNoMods,
  onDecrementNoMods,
}: ProductFooterProps) => {
  return (
    <div className='w-full p-4 sm:p-5 bg-white border-t border-gray-100 shrink-0'>
      {sizes.length > 0 ? (
        <div className='flex gap-4'>
          <div className='flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 w-1/3'>
            <button
              onClick={() => onCounterChange(-1)}
              className='text-xl text-gray-600 font-medium px-2'
            >
              -
            </button>
            <span className='font-bold text-gray-900'>{counter}</span>
            <button
              onClick={() => onCounterChange(1)}
              className='text-xl text-gray-600 font-medium px-2'
            >
              +
            </button>
          </div>
          <button
            onClick={onAddWithMods}
            className='flex-1 py-3 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-opacity'
            style={{ backgroundColor: colorTheme }}
          >
            Добавить
          </button>
        </div>
      ) : (
        <div className='w-full'>
          {!foundCartItemNoMods ? (
            <button
              onClick={onAddNoMods}
              className='w-full py-3 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-opacity'
              style={{ backgroundColor: colorTheme }}
            >
              В корзину за {price} с
            </button>
          ) : (
            <div
              className='flex items-center justify-between rounded-xl px-4 py-3 text-white shadow-md'
              style={{ backgroundColor: colorTheme }}
            >
              <button
                onClick={onDecrementNoMods}
                className='text-2xl font-medium px-4 hover:scale-110 transition-transform'
              >
                -
              </button>
              <span className='font-bold text-lg tabular-nums'>
                {foundCartItemNoMods.quantity}
              </span>
              <button
                onClick={onAddNoMods}
                className='text-2xl font-medium px-4 hover:scale-110 transition-transform'
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
