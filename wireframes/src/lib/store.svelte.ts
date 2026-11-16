import type { DayCode, Instrument, RankingStrategy, RejectionReason, Role } from "$lib/schemas";
import { getWorkloadTier, type WorkloadTier } from "$lib/utils";

export const DAYS: DayCode[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ALL_SLOTS: string[] = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export function isOperatingSlot(day: DayCode, slot: string): boolean {
  if (day === "Sat" || day === "Sun") {
    return slot >= "08:00" && slot <= "20:30";
  }
  return slot >= "09:00" && slot <= "20:30";
}

export function endTimeOf(slot: string): string {
  const [hh, mm] = slot.split(":").map(Number);
  if (mm === 30) return `${String(hh + 1).padStart(2, "0")}:00`;
  return `${String(hh).padStart(2, "0")}:30`;
}

export interface WeekMeta {
  id: string;
  label: string;
  rangeText: string;
  dates: Record<DayCode, string>;
  status: "Draft" | "Confirmed";
}

export interface StaffAccount {
  staffId: string;
  fullName: string;
  email: string;
  contact: string;
  role: Role;
  active: boolean;
  instruments: Instrument[];
  homeStudio: string;
  baseWeeklyHours: number;
  baseMonthlyHours: number;
  enrolledStudents: number;
  preferredDays: DayCode[];
  preferredStudio: string;
  declaredMonthlyHours: number;
  unavailableSlots: string[]; // format: "Wed@15:00"
  adjacentContinuousHours: Record<string, number>; // slot key -> adjacent block hours
}

export interface Studio {
  studioId: string;
  name: string;
  equippedInstruments: Instrument[];
  baseWeeklyBookedHours: number;
}

export interface MaintenanceWindow {
  id: string;
  studioId: string;
  weekId: string;
  day: DayCode;
  startSlot: string;
  endSlot: string;
  reason: string;
}

export interface LessonSlot {
  lessonId: string;
  weekId: string;
  day: DayCode;
  slot: string;
  studentName: string;
  grade: string;
  instrument: Instrument;
  teacherId: string | null;
  studioId: string | null;
  status: "Confirmed" | "Unassigned" | "RejectionPending";
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
}

export type AuditAction =
  | "ALLOCATION_CONFIRMED"
  | "OVERTIME_CONFIRMED"
  | "ROSTER_NOTIFIED"
  | "REJECTION_REQUESTED"
  | "REJECTION_RESOLVED"
  | "AVAILABILITY_SAVED"
  | "PREFERENCES_SAVED"
  | "STUDIO_CONFIGURED"
  | "MAINTENANCE_SCHEDULED"
  | "ACCOUNT_PROVISIONED"
  | "ACCOUNT_STATUS_CHANGED";

export interface AuditEntry {
  logId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: AuditAction;
  target: string;
  details: string;
  hash: string;
}

export interface CandidateEvaluation {
  teacher: StaffAccount;
  currentWeekly: number;
  projectedWeekly: number;
  monthlyHours: number;
  tier: WorkloadTier;
  projectedTier: WorkloadTier;
  continuousBefore: number;
  continuousAfter: number;
  isQualified: boolean;
  isAvailable: boolean;
  withinContinuousLimit: boolean;
  withinStatutoryCap: boolean;
  eligible: boolean;
  ruleCode: "R1" | "R2" | "R3" | "R4" | "R6" | "R7";
  ruleReason: string;
  dayMatch: boolean;
  studioMatch: boolean;
  locationOnDay: string;
}

const WEEKS_SEED: WeekMeta[] = [
  {
    id: "W46",
    label: "Week 46",
    rangeText: "09/11/2026 - 15/11/2026",
    dates: {
      Mon: "9 Nov",
      Tue: "10 Nov",
      Wed: "11 Nov",
      Thu: "12 Nov",
      Fri: "13 Nov",
      Sat: "14 Nov",
      Sun: "15 Nov",
    },
    status: "Confirmed",
  },
  {
    id: "W47",
    label: "Week 47",
    rangeText: "16/11/2026 - 22/11/2026",
    dates: {
      Mon: "16 Nov",
      Tue: "17 Nov",
      Wed: "18 Nov",
      Thu: "19 Nov",
      Fri: "20 Nov",
      Sat: "21 Nov",
      Sun: "22 Nov",
    },
    status: "Draft",
  },
  {
    id: "W48",
    label: "Week 48",
    rangeText: "23/11/2026 - 29/11/2026",
    dates: {
      Mon: "23 Nov",
      Tue: "24 Nov",
      Wed: "25 Nov",
      Thu: "26 Nov",
      Fri: "27 Nov",
      Sat: "28 Nov",
      Sun: "29 Nov",
    },
    status: "Draft",
  },
];

const ACCOUNTS_SEED: StaffAccount[] = [
  {
    staffId: "M-01",
    fullName: "Grace Tan",
    email: "grace.tan@harmony.edu.sg",
    contact: "+65 9123 4401",
    role: "Manager",
    active: true,
    instruments: [],
    homeStudio: "Office",
    baseWeeklyHours: 43.0,
    baseMonthlyHours: 172.0,
    enrolledStudents: 0,
    preferredDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    preferredStudio: "S-01",
    declaredMonthlyHours: 0,
    unavailableSlots: [],
    adjacentContinuousHours: {},
  },
  {
    staffId: "M-02",
    fullName: "Daniel Ong",
    email: "daniel.ong@harmony.edu.sg",
    contact: "+65 9123 4402",
    role: "Manager",
    active: true,
    instruments: [],
    homeStudio: "Office",
    baseWeeklyHours: 43.0,
    baseMonthlyHours: 172.0,
    enrolledStudents: 0,
    preferredDays: ["Wed", "Thu", "Fri", "Sat", "Sun"],
    preferredStudio: "S-01",
    declaredMonthlyHours: 0,
    unavailableSlots: [],
    adjacentContinuousHours: {},
  },
  {
    staffId: "IT-01",
    fullName: "Alex Wong",
    email: "alex.wong@harmony.edu.sg",
    contact: "+65 9888 1020",
    role: "IT Admin",
    active: true,
    instruments: [],
    homeStudio: "Admin",
    baseWeeklyHours: 40.0,
    baseMonthlyHours: 160.0,
    enrolledStudents: 0,
    preferredDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    preferredStudio: "S-01",
    declaredMonthlyHours: 0,
    unavailableSlots: [],
    adjacentContinuousHours: {},
  },
  // 9 Active Teachers matching Music School brief (5 Piano, 1 Drums, 2 Violin, 1 Trumpet)
  {
    staffId: "T-01",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@harmony.edu.sg",
    contact: "+65 8112 3001",
    role: "Teacher",
    active: true,
    instruments: ["Piano"],
    homeStudio: "S-01",
    baseWeeklyHours: 14.0, // + 28 lessons (14.0h) in W47 = 28.0h total
    baseMonthlyHours: 98.0,
    enrolledStudents: 36,
    preferredDays: ["Mon", "Tue", "Thu", "Sat"],
    preferredStudio: "S-01",
    declaredMonthlyHours: 168.0,
    unavailableSlots: ["Sun@09:00", "Sun@09:30", "Wed@15:00", "Wed@18:00"],
    adjacentContinuousHours: { "Wed@15:00": 2.0, "Thu@16:00": 3.5 },
  },
  {
    staffId: "T-02",
    fullName: "David Koh",
    email: "david.koh@harmony.edu.sg",
    contact: "+65 8112 3002",
    role: "Teacher",
    active: true,
    instruments: ["Piano"],
    homeStudio: "S-02",
    baseWeeklyHours: 37.5,
    baseMonthlyHours: 150.0,
    enrolledStudents: 38,
    preferredDays: ["Mon", "Wed", "Fri"],
    preferredStudio: "S-02",
    declaredMonthlyHours: 176.0,
    unavailableSlots: ["Wed@15:00", "Sat@14:00"],
    adjacentContinuousHours: { "Tue@11:00": 4.0, "Fri@10:00": 1.5 },
  },
  {
    staffId: "T-03",
    fullName: "Hannah Koh",
    email: "hannah.koh@harmony.edu.sg",
    contact: "+65 8112 3003",
    role: "Teacher",
    active: true,
    instruments: ["Piano"],
    homeStudio: "S-04",
    baseWeeklyHours: 24.5,
    baseMonthlyHours: 98.0,
    enrolledStudents: 28,
    preferredDays: ["Tue", "Thu", "Sat", "Sun"],
    preferredStudio: "S-04",
    declaredMonthlyHours: 144.0,
    unavailableSlots: ["Wed@15:00"],
    adjacentContinuousHours: { "Thu@16:00": 4.0, "Sat@10:00": 1.0 },
  },
  {
    staffId: "T-04",
    fullName: "Michael Chen",
    email: "michael.chen@harmony.edu.sg",
    contact: "+65 8112 3004",
    role: "Teacher",
    active: true,
    instruments: ["Drums"],
    homeStudio: "S-05",
    baseWeeklyHours: 39.5,
    baseMonthlyHours: 158.0,
    enrolledStudents: 26,
    preferredDays: ["Mon", "Wed", "Fri", "Sat"],
    preferredStudio: "S-05",
    declaredMonthlyHours: 180.0,
    unavailableSlots: ["Tue@09:00"],
    adjacentContinuousHours: { "Thu@17:00": 2.5, "Sat@11:00": 3.0 },
  },
  {
    staffId: "T-05",
    fullName: "Chloe Teo",
    email: "chloe.teo@harmony.edu.sg",
    contact: "+65 8112 3005",
    role: "Teacher",
    active: true,
    instruments: ["Trumpet"],
    homeStudio: "S-04",
    baseWeeklyHours: 44.0, // + 1 lesson L-601 (0.5h) = 44.5h Overworked
    baseMonthlyHours: 177.5,
    enrolledStudents: 19,
    preferredDays: ["Tue", "Wed", "Fri", "Sat"],
    preferredStudio: "S-04",
    declaredMonthlyHours: 182.0,
    unavailableSlots: ["Mon@09:00"],
    adjacentContinuousHours: { "Fri@15:00": 2.0 },
  },
  {
    staffId: "T-06",
    fullName: "Marcus Lim",
    email: "marcus.lim@harmony.edu.sg",
    contact: "+65 8112 3006",
    role: "Teacher",
    active: true,
    instruments: ["Piano"],
    homeStudio: "S-01",
    baseWeeklyHours: 21.0,
    baseMonthlyHours: 84.0,
    enrolledStudents: 25,
    preferredDays: ["Fri", "Sat"],
    preferredStudio: "S-03",
    declaredMonthlyHours: 152.0,
    unavailableSlots: ["Mon@10:00"],
    adjacentContinuousHours: { "Wed@15:00": 1.5, "Sat@10:00": 2.0 },
  },
  {
    staffId: "T-07",
    fullName: "Elena Lim",
    email: "elena.lim@harmony.edu.sg",
    contact: "+65 8112 3007",
    role: "Teacher",
    active: true,
    instruments: ["Violin", "Piano"],
    homeStudio: "S-03",
    baseWeeklyHours: 16.5,
    baseMonthlyHours: 66.0,
    enrolledStudents: 18,
    preferredDays: ["Tue", "Thu", "Sat"],
    preferredStudio: "S-03",
    declaredMonthlyHours: 136.0,
    unavailableSlots: ["Fri@19:00"],
    adjacentContinuousHours: { "Wed@15:00": 1.0, "Tue@14:00": 2.0 },
  },
  {
    staffId: "T-08",
    fullName: "James Lee",
    email: "james.lee@harmony.edu.sg",
    contact: "+65 8112 3008",
    role: "Teacher",
    active: true,
    instruments: ["Piano"],
    homeStudio: "S-02",
    baseWeeklyHours: 40.5,
    baseMonthlyHours: 162.0,
    enrolledStudents: 41,
    preferredDays: ["Mon", "Wed", "Fri"],
    preferredStudio: "S-02",
    declaredMonthlyHours: 184.0,
    unavailableSlots: ["Sun@18:00"],
    adjacentContinuousHours: { "Wed@15:00": 2.5 },
  },
  {
    staffId: "T-09",
    fullName: "Priya Nair",
    email: "priya.nair@harmony.edu.sg",
    contact: "+65 8112 3009",
    role: "Teacher",
    active: true,
    instruments: ["Violin"],
    homeStudio: "S-03",
    baseWeeklyHours: 43.5,
    baseMonthlyHours: 174.0,
    enrolledStudents: 20,
    preferredDays: ["Mon", "Thu", "Sat", "Sun"],
    preferredStudio: "S-03",
    declaredMonthlyHours: 180.0,
    unavailableSlots: ["Tue@15:00"],
    adjacentContinuousHours: { "Sat@14:00": 2.5 },
  },
  // Logically Deactivated Account (NFR-REL-02)
  {
    staffId: "T-10",
    fullName: "Ruth Gomez",
    email: "ruth.gomez@harmony.edu.sg",
    contact: "+65 8112 3010",
    role: "Teacher",
    active: false,
    instruments: ["Violin"],
    homeStudio: "S-03",
    baseWeeklyHours: 0,
    baseMonthlyHours: 0,
    enrolledStudents: 0,
    preferredDays: ["Tue", "Thu"],
    preferredStudio: "S-03",
    declaredMonthlyHours: 0,
    unavailableSlots: [],
    adjacentContinuousHours: {},
  },
];

const STUDIOS_SEED: Studio[] = [
  {
    studioId: "S-01",
    name: "Studio 1",
    equippedInstruments: ["Piano", "Violin", "Trumpet"],
    baseWeeklyBookedHours: 51.0,
  },
  {
    studioId: "S-02",
    name: "Studio 2",
    equippedInstruments: ["Piano", "Violin", "Trumpet"],
    baseWeeklyBookedHours: 64.5,
  },
  {
    studioId: "S-03",
    name: "Studio 3",
    equippedInstruments: ["Piano", "Violin", "Trumpet"],
    baseWeeklyBookedHours: 58.0,
  },
  {
    studioId: "S-04",
    name: "Studio 4",
    equippedInstruments: ["Piano", "Violin", "Trumpet"],
    baseWeeklyBookedHours: 48.0,
  },
  {
    studioId: "S-05",
    name: "Studio 5",
    equippedInstruments: ["Piano", "Drums", "Violin", "Trumpet"],
    baseWeeklyBookedHours: 58.0,
  },
];

const MAINTENANCE_SEED: MaintenanceWindow[] = [
  {
    id: "MW-01",
    studioId: "S-04",
    weekId: "W47",
    day: "Wed",
    startSlot: "14:00",
    endSlot: "16:00",
    reason: "Piano action regulation & tuning",
  },
  {
    id: "MW-02",
    studioId: "S-02",
    weekId: "W48",
    day: "Tue",
    startSlot: "09:00",
    endSlot: "11:00",
    reason: "Acoustic panel servicing",
  },
];

// Realistic student lessons for T-01 Sarah Jenkins in W47 (28 slots = 14.0h + 14.0h base = 28.0h)
// Includes a full 4.0h continuous block Mon 09:00-13:00 (8 slots), 13:00-14:00 mandatory 1h rest, then 14:00-16:00
const SARAH_W47_LESSONS: LessonSlot[] = [
  {
    lessonId: "L-301",
    weekId: "W47",
    day: "Mon",
    slot: "09:00",
    studentName: "Ethan Lim",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-302",
    weekId: "W47",
    day: "Mon",
    slot: "09:30",
    studentName: "Maya Tan",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-303",
    weekId: "W47",
    day: "Mon",
    slot: "10:00",
    studentName: "Lucas Wong",
    grade: "Grade 2",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-304",
    weekId: "W47",
    day: "Mon",
    slot: "10:30",
    studentName: "Chloe Ng",
    grade: "Grade 6",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-305",
    weekId: "W47",
    day: "Mon",
    slot: "11:00",
    studentName: "Aiden Goh",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-306",
    weekId: "W47",
    day: "Mon",
    slot: "11:30",
    studentName: "Sofia Chua",
    grade: "Grade 7",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-307",
    weekId: "W47",
    day: "Mon",
    slot: "12:00",
    studentName: "Ryan Ho",
    grade: "Grade 1",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-308",
    weekId: "W47",
    day: "Mon",
    slot: "12:30",
    studentName: "Zoe Tay",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  // 13:00 - 14:00: Mandatory 1.0h rest break after 4.0h continuous block!
  {
    lessonId: "L-309",
    weekId: "W47",
    day: "Mon",
    slot: "14:00",
    studentName: "Noah Yeo",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-310",
    weekId: "W47",
    day: "Mon",
    slot: "14:30",
    studentName: "Aria Sim",
    grade: "Grade 8",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },

  {
    lessonId: "L-311",
    weekId: "W47",
    day: "Tue",
    slot: "10:00",
    studentName: "Caleb Ong",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-312",
    weekId: "W47",
    day: "Tue",
    slot: "10:30",
    studentName: "Hannah Low",
    grade: "Grade 6",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-313",
    weekId: "W47",
    day: "Tue",
    slot: "11:00",
    studentName: "Isaac Teo",
    grade: "Grade 2",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-314",
    weekId: "W47",
    day: "Tue",
    slot: "11:30",
    studentName: "Claire Yap",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-315",
    weekId: "W47",
    day: "Tue",
    slot: "15:00",
    studentName: "Jayden Kwan",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-316",
    weekId: "W47",
    day: "Tue",
    slot: "15:30",
    studentName: "Emma Pang",
    grade: "Grade 7",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },

  {
    lessonId: "L-352",
    weekId: "W47",
    day: "Wed",
    slot: "11:00",
    studentName: "Liam Seah",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "RejectionPending",
    rejectionReason: "Medical / Personal",
    rejectionNote: "Hospital dental appointment at 11:00",
  },
  {
    lessonId: "L-318",
    weekId: "W47",
    day: "Wed",
    slot: "11:30",
    studentName: "Olivia Soh",
    grade: "Grade 2",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },

  {
    lessonId: "L-319",
    weekId: "W47",
    day: "Thu",
    slot: "13:00",
    studentName: "Daniel Foo",
    grade: "Grade 6",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-320",
    weekId: "W47",
    day: "Thu",
    slot: "13:30",
    studentName: "Grace Chee",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-321",
    weekId: "W47",
    day: "Thu",
    slot: "14:00",
    studentName: "Samuel Lau",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-322",
    weekId: "W47",
    day: "Thu",
    slot: "14:30",
    studentName: "Rachel Mok",
    grade: "Grade 8",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },

  {
    lessonId: "L-323",
    weekId: "W47",
    day: "Fri",
    slot: "16:00",
    studentName: "Benjamin Wee",
    grade: "Grade 1",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-324",
    weekId: "W47",
    day: "Fri",
    slot: "16:30",
    studentName: "Nadia Ang",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },

  {
    lessonId: "L-325",
    weekId: "W47",
    day: "Sat",
    slot: "09:00",
    studentName: "Owen Phua",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-326",
    weekId: "W47",
    day: "Sat",
    slot: "09:30",
    studentName: "vera Quek",
    grade: "Grade 2",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-327",
    weekId: "W47",
    day: "Sat",
    slot: "10:00",
    studentName: "Kieran Chia",
    grade: "Grade 6",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-328",
    weekId: "W47",
    day: "Sat",
    slot: "10:30",
    studentName: "Megan Heng",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
];

const OTHER_LESSONS_SEED: LessonSlot[] = [
  // Chloe Teo's extra 0.5h lesson pushing her to 44.5h Overworked
  {
    lessonId: "L-601",
    weekId: "W47",
    day: "Fri",
    slot: "17:00",
    studentName: "Gavin Ho",
    grade: "Grade 4",
    instrument: "Trumpet",
    teacherId: "T-05",
    studioId: "S-04",
    status: "Confirmed",
  },
  // Unassigned lessons queue for W47 (demonstrating Piano, Drums, Violin, Trumpet & all rules R1-R7)
  {
    lessonId: "L-409",
    weekId: "W47",
    day: "Wed",
    slot: "15:00",
    studentName: "Jeremy Tan",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  {
    lessonId: "L-518",
    weekId: "W47",
    day: "Thu",
    slot: "17:00",
    studentName: "matthew Koh",
    grade: "Grade 3",
    instrument: "Drums",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  {
    lessonId: "L-417",
    weekId: "W47",
    day: "Tue",
    slot: "14:00",
    studentName: "Clarissa Lim",
    grade: "Grade 6",
    instrument: "Violin",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  {
    lessonId: "L-522",
    weekId: "W47",
    day: "Thu",
    slot: "16:00",
    studentName: "Aaron Yeo",
    grade: "Grade 2",
    instrument: "Piano",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  {
    lessonId: "L-529",
    weekId: "W47",
    day: "Sat",
    slot: "14:00",
    studentName: "Sophie Lee",
    grade: "Grade 5",
    instrument: "Violin",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  {
    lessonId: "L-534",
    weekId: "W47",
    day: "Fri",
    slot: "15:00",
    studentName: "Darius Tan",
    grade: "Grade 3",
    instrument: "Trumpet",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
  // W46 & W48 sample lessons for week switching
  {
    lessonId: "L-201",
    weekId: "W46",
    day: "Mon",
    slot: "10:00",
    studentName: "Ethan Lim",
    grade: "Grade 3",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-202",
    weekId: "W46",
    day: "Wed",
    slot: "14:00",
    studentName: "Maya Tan",
    grade: "Grade 5",
    instrument: "Piano",
    teacherId: "T-01",
    studioId: "S-01",
    status: "Confirmed",
  },
  {
    lessonId: "L-701",
    weekId: "W48",
    day: "Tue",
    slot: "10:00",
    studentName: "Caleb Ong",
    grade: "Grade 4",
    instrument: "Piano",
    teacherId: null,
    studioId: null,
    status: "Unassigned",
  },
];

const AUDIT_SEED: AuditEntry[] = [
  {
    logId: "AL-2215",
    timestamp: "2026-11-16 09:42:18",
    actorId: "T-01",
    actorName: "Sarah Jenkins",
    actorRole: "Teacher",
    action: "REJECTION_REQUESTED",
    target: "L-352 (Wed 11:00, S-01)",
    details:
      "Reason: Medical / Personal — Hospital dental appointment at 11:00; manager consultation acknowledged",
    hash: "9e3f..6b42",
  },
  {
    logId: "AL-2214",
    timestamp: "2026-11-15 17:05:12",
    actorId: "T-01",
    actorName: "Sarah Jenkins",
    actorRole: "Teacher",
    action: "AVAILABILITY_SAVED",
    target: "T-01 · Dec 2026",
    details:
      "Declared 168.0 h (>= 60.0 h floor) before 19 Nov 23:59 cutoff; preferred Mon/Tue/Thu/Sat, S-01",
    hash: "a17f..3d92",
  },
  {
    logId: "AL-2213",
    timestamp: "2026-11-15 15:22:04",
    actorId: "M-01",
    actorName: "Grace Tan",
    actorRole: "Manager",
    action: "OVERTIME_CONFIRMED",
    target: "T-09 Priya Nair (43.5 h)",
    details:
      "Authorized within 40.0–44.0 h statutory warning band; justification: Grade 8 recital prep",
    hash: "8f9a..3e21",
  },
  {
    logId: "AL-2212",
    timestamp: "2026-11-14 18:45:11",
    actorId: "IT-01",
    actorName: "Alex Wong",
    actorRole: "IT Admin",
    action: "MAINTENANCE_SCHEDULED",
    target: "S-04 · Wed 18 Nov 14:00–16:00",
    details: "Piano action regulation & tuning; S-04 excluded from W47 Wed 14:00–16:00 allocations",
    hash: "7d2e..1f88",
  },
  {
    logId: "AL-2211",
    timestamp: "2026-11-14 11:10:05",
    actorId: "IT-01",
    actorName: "Alex Wong",
    actorRole: "IT Admin",
    action: "STUDIO_CONFIGURED",
    target: "S-05 (Studio 5)",
    details: "Configured equippedInstruments = {Piano, Drums, Violin, Trumpet}",
    hash: "5b0c..91ea",
  },
  {
    logId: "AL-2210",
    timestamp: "2026-11-10 09:00:33",
    actorId: "M-02",
    actorName: "Daniel Ong",
    actorRole: "Manager",
    action: "ROSTER_NOTIFIED",
    target: "Week 46 (09–15 Nov 2026)",
    details:
      "Confirmed weekly schedule; dispatched notifications via Email, Dashboard & Audit observers to 9 teachers",
    hash: "4c1b..9a04",
  },
  {
    logId: "AL-2209",
    timestamp: "2026-10-31 17:30:00",
    actorId: "IT-01",
    actorName: "Alex Wong",
    actorRole: "IT Admin",
    action: "ACCOUNT_STATUS_CHANGED",
    target: "T-10 Ruth Gomez",
    details:
      "Logical status set to Deactivated; historical schedule and audit references preserved",
    hash: "1d88..44ef",
  },
];

function buildDefaultAvailabilityGrid(): Record<string, boolean> {
  const grid: Record<string, boolean> = {};
  for (const day of DAYS) {
    if (day === "Sun") continue;
    for (const slot of ALL_SLOTS) {
      if (!isOperatingSlot(day, slot)) continue;
      if (slot >= "09:00" && slot <= "16:30") {
        grid[`${day}@${slot}`] = true;
      }
    }
  }
  return grid;
}

function shortHash(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `${hex.slice(0, 4)}..${hex.slice(4, 8)}`;
}

class AcademyStore {
  activeRole = $state<Role>("Manager");
  activeTeacherId = $state<string>("T-01");
  selectedWeekId = $state<string>("W47");
  rankingStrategy = $state<RankingStrategy>("WorkloadDeficit");

  weeks = $state<WeekMeta[]>(structuredClone(WEEKS_SEED));
  accounts = $state<StaffAccount[]>(structuredClone(ACCOUNTS_SEED));
  studios = $state<Studio[]>(structuredClone(STUDIOS_SEED));
  maintenanceWindows = $state<MaintenanceWindow[]>(structuredClone(MAINTENANCE_SEED));
  lessons = $state<LessonSlot[]>([
    ...structuredClone(SARAH_W47_LESSONS).map((l) => ({
      ...l,
      studentName: l.studentName.replace(/^([a-z])/, (m) => m.toUpperCase()),
    })),
    ...structuredClone(OTHER_LESSONS_SEED).map((l) => ({
      ...l,
      studentName: l.studentName.replace(/^([a-z])/, (m) => m.toUpperCase()),
    })),
  ]);
  auditLogs = $state<AuditEntry[]>(structuredClone(AUDIT_SEED));
  teacherDecGrid = $state<Record<string, boolean>>(buildDefaultAvailabilityGrid());
  toastMessage = $state<string | null>(null);
  auditSeq = $state<number>(2216);

  currentWeek = $derived(this.weeks.find((w) => w.id === this.selectedWeekId) ?? this.weeks[1]);

  currentActor = $derived.by(() => {
    if (this.activeRole === "Manager") {
      return this.accounts.find((a) => a.staffId === "M-01")!;
    }
    if (this.activeRole === "IT Admin") {
      return this.accounts.find((a) => a.staffId === "IT-01")!;
    }
    return (
      this.accounts.find((a) => a.staffId === this.activeTeacherId) ??
      this.accounts.find((a) => a.staffId === "T-01")!
    );
  });

  activeTeachers = $derived(this.accounts.filter((a) => a.role === "Teacher" && a.active));

  notifyToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) this.toastMessage = null;
    }, 4000);
  }

  appendAudit(action: AuditAction, target: string, details: string) {
    const idNum = this.auditSeq++;
    const logId = `AL-${idNum}`;
    const now = new Date();
    const ts = `2026-11-16 ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const actor = this.currentActor;
    const entry: AuditEntry = {
      logId,
      timestamp: ts,
      actorId: actor.staffId,
      actorName: actor.fullName,
      actorRole: actor.role,
      action,
      target,
      details,
      hash: shortHash(`${logId}-${ts}-${target}-${details}`),
    };
    this.auditLogs = [entry, ...this.auditLogs];
  }

  getTeacherWeeklyHours(teacherId: string, weekId = this.selectedWeekId): number {
    const acc = this.accounts.find((a) => a.staffId === teacherId);
    if (!acc || !acc.active) return 0;
    const assignedCount = this.lessons.filter(
      (l) =>
        l.weekId === weekId &&
        l.teacherId === teacherId &&
        (l.status === "Confirmed" || l.status === "RejectionPending"),
    ).length;
    if (weekId === "W47") {
      return acc.baseWeeklyHours + assignedCount * 0.5;
    }
    return Math.max(12, acc.baseWeeklyHours - 2.0) + assignedCount * 0.5;
  }

  getTeacherMonthlyHours(teacherId: string): number {
    const acc = this.accounts.find((a) => a.staffId === teacherId);
    if (!acc || !acc.active) return 0;
    const w47Assigned = this.lessons.filter(
      (l) =>
        l.weekId === "W47" &&
        l.teacherId === teacherId &&
        (l.status === "Confirmed" || l.status === "RejectionPending"),
    ).length;
    return acc.baseMonthlyHours + w47Assigned * 0.5;
  }

  getTeacherAssignedStudio(teacherId: string, day?: DayCode): string {
    const acc = this.accounts.find((a) => a.staffId === teacherId);
    if (!acc) return "—";
    const match = this.lessons.find(
      (l) =>
        l.weekId === this.selectedWeekId &&
        l.teacherId === teacherId &&
        (day ? l.day === day : true) &&
        l.studioId,
    );
    return match?.studioId ?? acc.homeStudio;
  }

  lowestThreeTeachers = $derived.by(() => {
    return [...this.activeTeachers]
      .map((t) => ({
        teacher: t,
        weeklyHours: this.getTeacherWeeklyHours(t.staffId),
        monthlyHours: this.getTeacherMonthlyHours(t.staffId),
      }))
      .sort((a, b) => a.weeklyHours - b.weeklyHours)
      .slice(0, 3);
  });

  isStudioUnderMaintenance(
    studioId: string,
    weekId: string,
    day: DayCode,
    slot: string,
  ): MaintenanceWindow | undefined {
    return this.maintenanceWindows.find(
      (m) =>
        m.studioId === studioId &&
        m.weekId === weekId &&
        m.day === day &&
        slot >= m.startSlot &&
        slot < m.endSlot,
    );
  }

  isStudioOccupied(
    studioId: string,
    weekId: string,
    day: DayCode,
    slot: string,
    excludeLessonId?: string,
  ): LessonSlot | undefined {
    return this.lessons.find(
      (l) =>
        l.lessonId !== excludeLessonId &&
        l.weekId === weekId &&
        l.day === day &&
        l.slot === slot &&
        l.studioId === studioId &&
        l.status !== "Unassigned",
    );
  }

  evaluateCandidatesForLesson(
    lesson: LessonSlot,
    targetStudioId?: string,
  ): { eligible: CandidateEvaluation[]; excluded: CandidateEvaluation[] } {
    const slotKey = `${lesson.day}@${lesson.slot}`;
    const studioTarget = targetStudioId ?? "S-02";

    const evaluations: CandidateEvaluation[] = this.activeTeachers.map((teacher) => {
      const currentWeekly = this.getTeacherWeeklyHours(teacher.staffId, lesson.weekId);
      const alreadyAssignedSameLesson = lesson.teacherId === teacher.staffId;
      const projectedWeekly = alreadyAssignedSameLesson ? currentWeekly : currentWeekly + 0.5;
      const monthlyHours = this.getTeacherMonthlyHours(teacher.staffId);
      const tier = getWorkloadTier(currentWeekly);
      const projectedTier = getWorkloadTier(projectedWeekly);

      const isQualified = teacher.instruments.includes(lesson.instrument);
      const slotClash = this.lessons.some(
        (l) =>
          l.lessonId !== lesson.lessonId &&
          l.weekId === lesson.weekId &&
          l.day === lesson.day &&
          l.slot === lesson.slot &&
          l.teacherId === teacher.staffId,
      );
      const isAvailable = !teacher.unavailableSlots.includes(slotKey) && !slotClash;

      const continuousBefore = teacher.adjacentContinuousHours[slotKey] ?? 1.5;
      const continuousAfter = continuousBefore + 0.5;
      const withinContinuousLimit = continuousAfter <= 4.0;
      const withinStatutoryCap = projectedWeekly <= 44.0;

      const dayMatch = teacher.preferredDays.includes(lesson.day);
      const studioMatch = teacher.preferredStudio === studioTarget;
      const locationOnDay = this.getTeacherAssignedStudio(teacher.staffId, lesson.day);

      let ruleCode: CandidateEvaluation["ruleCode"] = "R7";
      let ruleReason = "All constraints satisfied";
      let eligible = true;

      if (!isQualified) {
        ruleCode = "R1";
        ruleReason = `Not certified for ${lesson.instrument}`;
        eligible = false;
      } else if (!isAvailable) {
        ruleCode = "R2";
        ruleReason = slotClash
          ? "Booked in another lesson"
          : `Unavailable ${lesson.day} ${lesson.slot}`;
        eligible = false;
      } else if (!withinContinuousLimit) {
        ruleCode = "R3";
        ruleReason = `Exceeds 4.0 h continuous block (${continuousAfter.toFixed(1)} h)`;
        eligible = false;
      } else if (!withinStatutoryCap) {
        ruleCode = "R4";
        ruleReason = `Exceeds 44.0 h statutory ceiling (${projectedWeekly.toFixed(1)} h)`;
        eligible = false;
      } else if (projectedWeekly >= 40.0) {
        ruleCode = "R6";
        ruleReason = `Enters 40.0–44.0 h warning tier (${projectedWeekly.toFixed(1)} h)`;
        eligible = true;
      }

      return {
        teacher,
        currentWeekly,
        projectedWeekly,
        monthlyHours,
        tier,
        projectedTier,
        continuousBefore,
        continuousAfter,
        isQualified,
        isAvailable,
        withinContinuousLimit,
        withinStatutoryCap,
        eligible,
        ruleCode,
        ruleReason,
        dayMatch,
        studioMatch,
        locationOnDay,
      };
    });

    const eligible = evaluations.filter((e) => e.eligible);
    const excluded = evaluations.filter((e) => !e.eligible);

    if (this.rankingStrategy === "WorkloadDeficit") {
      eligible.sort((a, b) => a.currentWeekly - b.currentWeekly);
    } else {
      eligible.sort((a, b) => {
        const scoreA = (a.dayMatch ? 1 : 0) + (a.studioMatch ? 1 : 0);
        const scoreB = (b.dayMatch ? 1 : 0) + (b.studioMatch ? 1 : 0);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.currentWeekly - b.currentWeekly;
      });
    }

    return { eligible, excluded };
  }

  allocateLesson(
    lessonId: string,
    teacherId: string,
    studioId: string,
    overtimeJustification?: string,
  ): { ok: boolean; error?: string } {
    const idx = this.lessons.findIndex((l) => l.lessonId === lessonId);
    if (idx === -1) return { ok: false, error: "Lesson not found" };
    const lesson = this.lessons[idx];
    const studio = this.studios.find((s) => s.studioId === studioId);
    if (!studio) return { ok: false, error: "Studio not found" };

    if (!studio.equippedInstruments.includes(lesson.instrument)) {
      return { ok: false, error: `Rule R5: ${studio.name} lacks ${lesson.instrument} equipment` };
    }
    const maint = this.isStudioUnderMaintenance(studioId, lesson.weekId, lesson.day, lesson.slot);
    if (maint) {
      return { ok: false, error: `Rule R5: ${studio.name} under maintenance (${maint.reason})` };
    }
    if (this.isStudioOccupied(studioId, lesson.weekId, lesson.day, lesson.slot, lesson.lessonId)) {
      return {
        ok: false,
        error: `Rule R5: ${studio.name} already occupied at ${lesson.day} ${lesson.slot}`,
      };
    }

    const { eligible, excluded } = this.evaluateCandidatesForLesson(lesson, studioId);
    const cand = [...eligible, ...excluded].find((c) => c.teacher.staffId === teacherId);
    if (!cand || !cand.eligible) {
      return {
        ok: false,
        error: cand ? `Rule ${cand.ruleCode}: ${cand.ruleReason}` : "Ineligible teacher",
      };
    }

    this.lessons[idx] = {
      ...lesson,
      teacherId,
      studioId,
      status: "Confirmed",
      rejectionReason: undefined,
      rejectionNote: undefined,
    };

    if (cand.ruleCode === "R6") {
      this.appendAudit(
        "OVERTIME_CONFIRMED",
        `${lesson.lessonId} -> ${cand.teacher.staffId} (${cand.projectedWeekly.toFixed(1)} h)`,
        `Assigned ${lesson.instrument} (${lesson.day} ${lesson.slot}, ${studioId}); overtime justification: ${overtimeJustification}`,
      );
    } else {
      this.appendAudit(
        "ALLOCATION_CONFIRMED",
        `${lesson.lessonId} -> ${cand.teacher.staffId} (${studioId})`,
        `Assigned ${lesson.studentName} (${lesson.instrument}, ${lesson.day} ${lesson.slot}) in ${studioId}; teacher notified`,
      );
    }

    this.notifyToast(
      `Confirmed ${lesson.lessonId} with ${cand.teacher.fullName} in ${studioId} · teacher notified`,
    );
    return { ok: true };
  }

  retainRejectedLesson(lessonId: string) {
    const idx = this.lessons.findIndex((l) => l.lessonId === lessonId);
    if (idx === -1) return;
    const l = this.lessons[idx];
    this.lessons[idx] = {
      ...l,
      status: "Confirmed",
      rejectionReason: undefined,
      rejectionNote: undefined,
    };
    this.appendAudit(
      "REJECTION_RESOLVED",
      `${l.lessonId} (${l.teacherId})`,
      `Retained ${l.teacherId} on ${l.day} ${l.slot} (${l.studioId}) following manager consultation`,
    );
    this.notifyToast(`Retained ${l.lessonId} as Confirmed after manager discussion`);
  }

  unassignLessonForReallocation(lessonId: string) {
    const idx = this.lessons.findIndex((l) => l.lessonId === lessonId);
    if (idx === -1) return;
    const l = this.lessons[idx];
    const prevTeacher = l.teacherId;
    this.lessons[idx] = {
      ...l,
      teacherId: null,
      studioId: null,
      status: "Unassigned",
      rejectionReason: undefined,
      rejectionNote: undefined,
    };
    this.appendAudit(
      "REJECTION_RESOLVED",
      `${l.lessonId}`,
      `Released ${prevTeacher ?? "teacher"} from ${l.day} ${l.slot}; returned slot to Unassigned queue`,
    );
    this.notifyToast(`Moved ${l.lessonId} to Unassigned queue`);
  }

  confirmWeekAndNotify(weekId = this.selectedWeekId) {
    const w = this.weeks.find((wk) => wk.id === weekId);
    if (!w) return;
    w.status = "Confirmed";
    const count = this.activeTeachers.length;
    this.appendAudit(
      "ROSTER_NOTIFIED",
      `${w.label} (${w.rangeText})`,
      `Confirmed weekly allocations; notified ${count} active teachers via Email, Dashboard & Audit observers`,
    );
    this.notifyToast(`Confirmed ${w.label} & notified ${count} assigned teachers`);
  }

  submitJobRejection(lessonId: string, reason: RejectionReason, note: string) {
    const idx = this.lessons.findIndex((l) => l.lessonId === lessonId);
    if (idx === -1) return;
    const l = this.lessons[idx];
    this.lessons[idx] = {
      ...l,
      status: "RejectionPending",
      rejectionReason: reason,
      rejectionNote: note,
    };
    this.appendAudit(
      "REJECTION_REQUESTED",
      `${l.lessonId} (${l.day} ${l.slot}, ${l.studioId})`,
      `Reason: ${reason} — ${note}; flagged for manager discussion`,
    );
    this.notifyToast(`Flagged ${l.lessonId} for manager discussion`);
  }

  saveTeacherAvailability(
    teacherId: string,
    declaredHours: number,
    preferredDays: DayCode[],
    preferredStudio: string,
  ) {
    const acc = this.accounts.find((a) => a.staffId === teacherId);
    if (!acc) return;
    acc.declaredMonthlyHours = declaredHours;
    acc.preferredDays = [...preferredDays];
    acc.preferredStudio = preferredStudio;

    this.appendAudit(
      "AVAILABILITY_SAVED",
      `${teacherId} · Dec 2026`,
      `Declared ${declaredHours.toFixed(1)} h (>= 60.0 h minimum); preferred ${preferredDays.join(", ")} · ${preferredStudio}`,
    );
    this.notifyToast(`Saved Dec 2026 availability (${declaredHours.toFixed(1)} h) & preferences`);
  }

  provisionAccount(data: {
    staffId: string;
    fullName: string;
    email: string;
    contact: string;
    role: Role;
    instruments: Instrument[];
    homeStudio: string;
  }): { ok: boolean; error?: string } {
    if (
      this.accounts.some(
        (a) =>
          a.staffId.toLowerCase() === data.staffId.toLowerCase() ||
          a.email.toLowerCase() === data.email.toLowerCase(),
      )
    ) {
      return { ok: false, error: "Duplicate Staff ID or school email already exists" };
    }
    this.accounts = [
      ...this.accounts,
      {
        staffId: data.staffId.toUpperCase(),
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        contact: data.contact,
        role: data.role,
        active: true,
        instruments: data.role === "Teacher" ? data.instruments : [],
        homeStudio: data.role === "Teacher" ? data.homeStudio : "Office",
        baseWeeklyHours: data.role === "Teacher" ? 0 : 40,
        baseMonthlyHours: data.role === "Teacher" ? 0 : 160,
        enrolledStudents: 0,
        preferredDays: ["Mon", "Wed", "Fri"],
        preferredStudio: data.homeStudio || "S-01",
        declaredMonthlyHours: 64.0,
        unavailableSlots: [],
        adjacentContinuousHours: {},
      },
    ];
    this.appendAudit(
      "ACCOUNT_PROVISIONED",
      `${data.staffId.toUpperCase()} ${data.fullName}`,
      `Provisioned ${data.role} account (${data.email})${
        data.role === "Teacher" ? ` · ${data.instruments.join(", ")}` : ""
      }`,
    );
    this.notifyToast(`Provisioned ${data.staffId.toUpperCase()} (${data.fullName})`);
    return { ok: true };
  }

  toggleAccountStatus(staffId: string) {
    const acc = this.accounts.find((a) => a.staffId === staffId);
    if (!acc) return;
    const nextActive = !acc.active;
    acc.active = nextActive;

    let movedCount = 0;
    if (!nextActive && acc.role === "Teacher") {
      this.lessons = this.lessons.map((l) => {
        if (l.teacherId === staffId) {
          movedCount++;
          return { ...l, teacherId: null, studioId: null, status: "Unassigned" };
        }
        return l;
      });
    }
    this.appendAudit(
      "ACCOUNT_STATUS_CHANGED",
      `${acc.staffId} ${acc.fullName}`,
      nextActive
        ? "Logical status restored to Active"
        : `Logical status set to Deactivated; ${movedCount} future lessons moved to Unassigned queue`,
    );
    this.notifyToast(
      nextActive
        ? `Reactivated ${acc.fullName}`
        : `Deactivated ${acc.fullName} (${movedCount} lessons queued for reallocation)`,
    );
  }

  toggleStudioInstrument(studioId: string, inst: Instrument) {
    const st = this.studios.find((s) => s.studioId === studioId);
    if (!st) return;
    const exists = st.equippedInstruments.includes(inst);
    if (exists && st.equippedInstruments.length === 1) {
      this.notifyToast(`${st.name} must retain at least one equipped instrument`);
      return;
    }
    st.equippedInstruments = exists
      ? st.equippedInstruments.filter((i) => i !== inst)
      : [...st.equippedInstruments, inst];

    this.appendAudit(
      "STUDIO_CONFIGURED",
      `${st.studioId} (${st.name})`,
      `Updated equippedInstruments = {${st.equippedInstruments.join(", ")}}`,
    );
    this.notifyToast(`Updated ${st.name}: ${st.equippedInstruments.join(", ")}`);
  }

  scheduleMaintenance(win: Omit<MaintenanceWindow, "id">): { affectedCount: number } {
    const id = `MW-0${this.maintenanceWindows.length + 1}`;
    let affectedCount = 0;
    this.lessons = this.lessons.map((l) => {
      if (
        l.studioId === win.studioId &&
        l.weekId === win.weekId &&
        l.day === win.day &&
        l.slot >= win.startSlot &&
        l.slot < win.endSlot
      ) {
        affectedCount++;
        return { ...l, teacherId: null, studioId: null, status: "Unassigned" };
      }
      return l;
    });

    this.maintenanceWindows = [{ id, ...win }, ...this.maintenanceWindows];
    this.appendAudit(
      "MAINTENANCE_SCHEDULED",
      `${win.studioId} · ${win.weekId} ${win.day} ${win.startSlot}–${win.endSlot}`,
      `${win.reason}; excluded studio from allocation (${affectedCount} lessons moved to Unassigned)`,
    );
    this.notifyToast(
      `Scheduled maintenance on ${win.studioId} (${win.day} ${win.startSlot}–${win.endSlot})`,
    );
    return { affectedCount };
  }

  removeMaintenance(id: string) {
    const target = this.maintenanceWindows.find((m) => m.id === id);
    if (!target) return;
    this.maintenanceWindows = this.maintenanceWindows.filter((m) => m.id !== id);
    this.appendAudit(
      "MAINTENANCE_SCHEDULED",
      `${target.studioId}`,
      `Cleared maintenance window ${target.day} ${target.startSlot}–${target.endSlot}`,
    );
    this.notifyToast(`Cleared maintenance window on ${target.studioId}`);
  }

  getStudioWeeklyStats(studioId: string, weekId = this.selectedWeekId) {
    const st = this.studios.find((s) => s.studioId === studioId)!;
    const maintHours = this.maintenanceWindows
      .filter((m) => m.studioId === studioId && m.weekId === weekId)
      .reduce((sum, m) => {
        const startIdx = ALL_SLOTS.indexOf(m.startSlot);
        const endIdx = ALL_SLOTS.indexOf(m.endSlot);
        return sum + Math.max(0, endIdx - startIdx) * 0.5;
      }, 0);
    const dynamicDelta =
      this.lessons.filter(
        (l) => l.weekId === weekId && l.studioId === studioId && l.status !== "Unassigned",
      ).length * 0.5;
    const baseOffset =
      studioId === "S-01" ? st.baseWeeklyBookedHours - 14.0 : st.baseWeeklyBookedHours;
    const bookedHours = Math.min(86.0 - maintHours, Math.max(0, baseOffset + dynamicDelta));
    const availableHours = 86.0 - maintHours;
    const pct = availableHours > 0 ? (bookedHours / availableHours) * 100 : 0;
    return { studio: st, bookedHours, maintHours, availableHours, pct };
  }
}

export const store = new AcademyStore();
