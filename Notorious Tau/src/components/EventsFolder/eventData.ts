import fundraiser from "../Photos/ConchasFund.jpeg";
import somePhoto from "../Photos/T.png";


export type EventItem = {
    name: string;
    price: string;
}

export type Awards = {
    title: string;
    year: string;
}

export type Knights = {
    id: string;
    type: string;
    name: string;
    position: string;
    knightName: string;
    imageURL: string;
    imagePath: string;
    lineNumber: string;
    lineName: string;
    crossDate: string;
    awards: Awards[];
}

export type Event = {
    id: string;
    eventTitle: string;
    description?: string;
    imageURL?: string;
    imagePath?: string;
    items?: EventItem[];
    date?: Date;
    createdAt: any;
}

export type Countdown = {
    id: string;
    title: string;
    imageURL: string;
    imagePath: string;
    targetDate: Date | any;
    createdAt: any;
}

export type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}


export const eventData: Event[] = [{
    id: "1203",
    eventTitle: "Conchas con Cafe",
    imageURL: fundraiser,
    imagePath: "Something",
    description: "Too cold and need something to warm you up? 🔥 Stop by on Tuesday, February 24, and treat yourself to a concha (or two😏) with some delicious Abuelita hot chocolate☕️! The Notorious Tau Chapter of Omega Delta Phi will be at the UC Mall from 11 AM to 2 PM. We hope to see you there and as always, stay hype! 🔥",
    items: [
        { name: "Conchas", price: "$3.00" },
        { name: "Abuelita Hot Chocolate", price: "$4.00" },
        { name: "Combo \n Conchas & Abuelita Hot Chocolate", price: "$6.00"}],
    createdAt: "any"
}, {
    id: "19394",
    eventTitle: "Another event",
    imageURL: somePhoto,
    imagePath: "Something",
    description: "This is a random description. I have to make the description long in order for the title to not be cut",
    items: [
        {name: "Item 1", price: "$3.00"},
        {name: "Item 2", price: "$3.00"}
    ],
    createdAt: "any"
}]