export type BaseDocument = {
  id: string;
  imageURL?: string;
  imagePath?: string;
  createdAt: any; // shared optional fields
  title?: string;
  description?: string;
  date?: Date | any;
  items?: EventItem[];
};

export type EventItem = {
  name: string;
  price: string;
};

export type Awards = {
  title: string;
  year: string;
};

export type Knights = BaseDocument & {
  type: string; // All items are required for knights
  name: string;
  position: string;
  knightName: string;
  lineNumber: string;
  lineName: string;
  crossDate: string;
  graduating: boolean;
  awards: Awards[];
};

export type Alumni = BaseDocument & {
  important: boolean;
};

export type Countdown = BaseDocument & {
  targetDate: Date | any;
  events?: CountdownEvent[];
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownEvent = {
  title: string;
  date: Date | any;
  location: string;
  startTime: string;
  endTime: string;
};
