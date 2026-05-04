import fundraiser from "../Photos/ConchasFund.jpeg";
import somePhoto from "../Photos/T.png";


export type BaseDocument = {
    id: string;
    imageURL?: string;
    imagePath?: string;
    createdAt: any;
    // shared optional fields
  title?: string;           // Countdown
  eventTitle?: string;      // Event uses this one
  name?: string;            // Only knights use this    
  description?: string;
  date?: Date | any;
  items?: EventItem[];
}

export type EventItem = {
    name: string;
    price: string;
}

export type Awards = {
    title: string;
    year: string;
}

export type Knights = BaseDocument & {
    type: string;
    name: string;
    position: string;
    knightName: string;
    lineNumber: string;
    lineName: string;
    crossDate: string;
    awards: Awards[];
}

export type Alumni = BaseDocument & {
    onlyAlumn: Boolean;
    important: Boolean;
}

export type Countdown = BaseDocument & {
    targetDate: Date | any;
    events? : CountdownEvent[];
    createdAt: any;
}

export type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export type CountdownEvent = {
    title: string;
    date: Date | any;
    location: string;
    startTime: string;
    endTime: string;
}
