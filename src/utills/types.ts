export interface optionsType {
  id?: string;
  label: string;
  value: string;
}

export type AddTimerType = {
  name: string;
  duration: number | null;
  remainingDuration: number | null;
  status: 'pending' | 'inProgress' | 'completed';
  category: string;
  halfWayNotification: boolean;
  successNotification: boolean;
};

export type TimerActionsType = {
  start: boolean;
  pause: boolean;
  reset: boolean;
  startAll: boolean;
  pauseAll: boolean;
  resetAll: boolean;
};

export type HalfWayNotificationNotificationDataType = {
  title: string;
  message: string;
};
