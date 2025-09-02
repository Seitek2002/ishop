export interface ISpot {
  id: number;
  name: string;
  address: string | null;
}

export interface IWorkSchedule {
  dayOfWeek: number;
  dayName: string;
  workStart: string;
  workEnd: string;
  isDayOff?: boolean;
}

export interface IVenues {
  colorTheme: string;
  companyName: string;
  slug: string;
  logo: string;
  schedule: string;
  serviceFeePercent: number;
  // Delivery pricing
  deliveryFixedFee?: string | number;
  deliveryFreeFrom?: string | number | null;
  // Optional weekly schedule from backend
  schedules?: IWorkSchedule[];
  defaultDeliverySpot?: number | null;
  table: {
    id: number;
    tableNum: string;
  };
  spots?: ISpot[];
  activeSpot: number;
  isDeliveryAvailable: boolean;
  isTakeoutAvailable: boolean;
  isDineinAvailable: boolean;
}
