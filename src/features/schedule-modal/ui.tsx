'use client';

import React, { useMemo } from 'react';
import { vibrateClick } from '@/shared/lib/haptics';
import type { WorkSchedule } from '@/shared/api/types'; // Берем тип, который мы писали в самом начале

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
    const arr: { label: string; time: string }[] = [];
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
        label: d.label,
        time: scheduleItemToText(mapByDow[d.dow], fallbackSchedule),
      });
    }
    return arr;
  }, [schedules, fallbackSchedule]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity'
        onClick={() => {
          vibrateClick();
          onClose();
        }}
      />
      <div className='fixed left-1/2 top-1/2 z-101 w-[90%] max-w-100 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        <div className='p-6'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 text-center'>
            График работы
          </h3>

          <div className='space-y-3 mb-8'>
            {weekly.map((row, idx) => (
              <div
                className='flex justify-between items-center text-base'
                key={idx}
              >
                <span className='text-gray-500 font-medium'>{row.label}</span>
                <span className='text-gray-900 font-semibold'>
                  {row.time.replace('-', ' - ')}
                </span>
              </div>
            ))}
          </div>

          <button
            style={{ backgroundColor: colorTheme }}
            className='w-full py-3 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity'
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            Ок
          </button>
        </div>
      </div>
    </>
  );
};
