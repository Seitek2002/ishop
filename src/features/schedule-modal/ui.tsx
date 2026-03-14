'use client';

import React, { useMemo, useEffect } from 'react';
import { X, CalendarClock } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import type { WorkSchedule } from '@/shared/api/types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules?: WorkSchedule[] | null;
  fallbackSchedule?: string;
  colorTheme?: string;
}

const DAY_ORDER = [
  { dow: 1, label: 'Пн' },
  { dow: 2, label: 'Вт' },
  { dow: 3, label: 'Ср' },
  { dow: 4, label: 'Чт' },
  { dow: 5, label: 'Пт' },
  { dow: 6, label: 'Сб' },
  { dow: 7, label: 'Вс' },
];

function formatSchedule(range: string): string {
  const trimmed = (range || '').trim();
  if (!trimmed) return 'не указан';
  if (trimmed === '00:00-00:00') return 'Круглосуточно';
  return trimmed;
}

function scheduleItemToText(
  s: WorkSchedule | undefined,
  fallback?: string,
): string {
  if (!s) {
    if (fallback) return formatSchedule(fallback);
    return 'не указан';
  }
  if (s.isDayOff) return '—';
  if (s.workStart && s.workEnd)
    return formatSchedule(`${s.workStart}-${s.workEnd}`);
  if (s.is24h) return 'Круглосуточно';
  return 'не указан';
}

export const WeeklyScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedules,
  fallbackSchedule,
  colorTheme = '#854C9D',
}) => {
  const weekly = useMemo(() => {
    const arr: { dow: number; label: string; time: string }[] = [];
    const mapByDow: Record<number, WorkSchedule> = {};

    if (Array.isArray(schedules)) {
      for (const it of schedules) {
        if (it && typeof it.dayOfWeek === 'number') {
          mapByDow[it.dayOfWeek] = it;
        }
      }
    }

    for (const d of DAY_ORDER) {
      arr.push({
        dow: d.dow, // Сохраняем номер дня для сравнения с текущим
        label: d.label,
        time: scheduleItemToText(mapByDow[d.dow], fallbackSchedule),
      });
    }
    return arr;
  }, [schedules, fallbackSchedule]);

  // Определяем текущий день недели (1 - Пн, 7 - Вс)
  const currentDow = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-100 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
        aria-hidden
      />

      <div
        className={`fixed left-1/2 top-1/2 z-101 w-[92%] max-w-100 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role='dialog'
      >
        <div className='p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CalendarClock className='w-5 h-5' style={{ color: colorTheme }} />
            <h3 className='text-lg sm:text-xl font-semibold text-gray-900'>
              График работы
            </h3>
          </div>
          <button
            aria-label='Закрыть'
            className='p-2 rounded-full hover:bg-gray-100 transition-colors'
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        <div className='p-5 sm:p-6'>
          <div className='bg-gray-50 rounded-xl border border-gray-100 overflow-hidden'>
            <ul className='divide-y divide-gray-100'>
              {weekly.map((row, idx) => {
                const isOff = row.time === '—' || row.time === 'не указан';
                const isToday = row.dow === currentDow;

                return (
                  <li
                    className={`flex justify-between items-center px-4 py-3 text-sm sm:text-base transition-colors ${
                      isToday ? 'bg-gray-100/80' : ''
                    }`}
                    key={idx}
                  >
                    <span
                      className={`font-medium flex items-center gap-2 ${isToday ? 'text-gray-900' : 'text-gray-600'}`}
                    >
                      {row.label}
                      {isToday && (
                        <span
                          className='text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full text-white'
                          style={{ backgroundColor: colorTheme }}
                        >
                          Сегодня
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-semibold ${isOff ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                      {row.time.replace('-', ' - ')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className='p-5 sm:p-6 pt-0'>
          <button
            style={{ backgroundColor: colorTheme }}
            className='w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity'
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            Понятно
          </button>
        </div>
      </div>
    </>
  );
};
