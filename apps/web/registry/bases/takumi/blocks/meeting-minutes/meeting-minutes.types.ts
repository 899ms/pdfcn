export interface MeetingMinutesAttendee {
  name: string;
  role?: string;
}

export interface MeetingMinutesDiscussion {
  topic: string;
  notes: string[];
  speaker?: string;
}

export interface MeetingMinutesDecision {
  number: number;
  decision: string;
  rationale?: string;
}

export type MeetingMinutesActionStatus =
  | "Not Started"
  | "In Progress"
  | "Complete";

export interface MeetingMinutesActionItem {
  task: string;
  owner: string;
  dueDate: string;
  status: MeetingMinutesActionStatus;
}

export interface MeetingMinutesNextMeeting {
  date: string;
  time: string;
  agenda?: string[];
}

export interface MeetingMinutesProps {
  meetingTitle: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: MeetingMinutesAttendee[];
  absent?: MeetingMinutesAttendee[];
  guests?: string[];
  agenda: string[];
  discussions: MeetingMinutesDiscussion[];
  decisions: MeetingMinutesDecision[];
  actionItems: MeetingMinutesActionItem[];
  nextMeeting?: MeetingMinutesNextMeeting;
  preparedBy: string;
  distributionList?: string[];
  accentColor?: string;
  renderingBase?: "takumi" | "forme";
}
