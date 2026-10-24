export type Intent = "must" | "maybe";

export type TimeSlot = "morning" | "forenoon" | "afternoon" | "evening";

export type Area =
  | "shibuya"
  | "shinjuku"
  | "shinagawa"
  | "ariake"
  | "setagaya"
  | "meguro";

export type Player = {
  id: string;
  name: string;
  initials: string;
  level: string;
  intent: Intent;
  /** 今日からの日数オフセット */
  dayOffsets: number[];
  timeSlots: TimeSlot[];
  areas: Area[];
  comment: string;
  experience: string;
  styles: PlayStyle[];
  homeCourt: string;
};

export type PlayStyle = "rally" | "doubles" | "singles" | "match";

export type CourtEvent = {
  id: string;
  title: string;
  dayOffset: number;
  time: string;
  venue: string;
  level: string;
  capacity: number;
  joined: number;
  fee: number;
  area: Area;
  organizer: string;
  description: string;
  bring: string[];
};

export type PlayRequest = {
  intent: Intent;
  /** YYYY-MM-DD */
  dates: string[];
  timeSlots: TimeSlot[];
  areas: Area[];
  updatedAt: string;
};

export type Invitation = {
  id: string;
  playerId: string;
  /** YYYY-MM-DD */
  date: string;
  timeSlot: TimeSlot;
  message: string;
  createdAt: string;
  status: InvitationStatus;
  reply?: string;
  repliedAt?: string;
};

export type InvitationStatus = "pending" | "accepted";
