import { APP_NAME } from "@/config/constants";
import { atTime } from "@/lib/date.utils";
import type {
  Class,
  ClassSession,
  Instructor,
  Reservation,
} from "@/types/schedule";

const today = new Date();

export const mockInstructors: Instructor[] = [
  { id: "instructor-1", name: "Betty White" },
];

export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Advanced CrossFit",
    category: "CrossFit",
    labels: [],
  },
  { id: "class-2", name: "Basic Crossfit", category: "CrossFit", labels: [] },
  { id: "class-3", name: "Salsa", category: "Dance", labels: [] },
];

export const mockClassSessions: ClassSession[] = [
  {
    id: "session-1",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 3,
    reservedCount: 3,
    classCapacity: 3,
    classReservedCount: 3,
  },
  {
    id: "session-2",
    classId: "class-2",
    instructorId: null,
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 5,
    reservedCount: 0,
    classCapacity: 5,
    classReservedCount: 0,
  },
  {
    id: "session-3",
    classId: "class-3",
    instructorId: "instructor-1",
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 3,
    reservedCount: 0,
    classCapacity: 3,
    classReservedCount: 0,
  },
  {
    id: "session-4",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 8, 0).toISOString(),
    durationMinutes: 60,
    capacity: 10,
    reservedCount: 0,
    classCapacity: 10,
    classReservedCount: 0,
  },
  {
    id: "session-5",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 11, 45).toISOString(),
    durationMinutes: 60,
    capacity: 4,
    reservedCount: 0,
    classCapacity: 4,
    classReservedCount: 0,
  },
  {
    id: "session-6",
    classId: "class-1",
    instructorId: "instructor-1",
    // Anchored to the actual current time (not a fixed hour like the sessions
    // above) so this class is always mid-session whenever the app is opened,
    // making the "before class ends" check-in state demoable without faking
    // the clock.
    startAt: new Date(Date.now() - 20 * 60_000).toISOString(),
    durationMinutes: 60,
    capacity: 8,
    reservedCount: 6,
    classCapacity: 8,
    classReservedCount: 6,
  },
];

export const mockReservations: Reservation[] = [
  {
    id: "reservation-1",
    sessionId: "session-1",
    clientName: "Ken Jones",
    clientTotalVisits: 16,
    bookingSource: APP_NAME,
    status: "attended",
    bookedAt: atTime(today, 6, 30).toISOString(),
  },
  {
    id: "reservation-2",
    sessionId: "session-1",
    clientName: "Holly Smith",
    clientTotalVisits: 68,
    bookingSource: APP_NAME,
    status: "no_show",
    bookedAt: atTime(today, 6, 45).toISOString(),
  },
  {
    id: "reservation-3",
    sessionId: "session-1",
    clientName: "Maria Lopez",
    clientTotalVisits: 3,
    bookingSource: APP_NAME,
    status: "booked",
    bookedAt: atTime(today, 6, 50).toISOString(),
  },
  {
    id: "reservation-4",
    sessionId: "session-6",
    clientName: "Jordan Lee",
    clientTotalVisits: 24,
    bookingSource: APP_NAME,
    status: "attended",
    bookedAt: atTime(today, 6, 0).toISOString(),
  },
  {
    id: "reservation-5",
    sessionId: "session-6",
    clientName: "Casey Kim",
    clientTotalVisits: 9,
    bookingSource: APP_NAME,
    status: "attended",
    bookedAt: atTime(today, 6, 5).toISOString(),
  },
  {
    id: "reservation-6",
    sessionId: "session-6",
    clientName: "Priya Patel",
    clientTotalVisits: 1,
    bookingSource: APP_NAME,
    status: "booked",
    bookedAt: atTime(today, 6, 10).toISOString(),
  },
  {
    id: "reservation-7",
    sessionId: "session-6",
    clientName: "Sam Rivera",
    clientTotalVisits: 5,
    bookingSource: APP_NAME,
    status: "booked",
    bookedAt: atTime(today, 6, 15).toISOString(),
  },
  {
    id: "reservation-8",
    sessionId: "session-6",
    clientName: "Taylor Chen",
    clientTotalVisits: 12,
    bookingSource: APP_NAME,
    status: "booked",
    bookedAt: atTime(today, 6, 20).toISOString(),
  },
  {
    id: "reservation-9",
    sessionId: "session-6",
    clientName: "Morgan Diaz",
    clientTotalVisits: 2,
    bookingSource: APP_NAME,
    status: "booked",
    bookedAt: atTime(today, 6, 25).toISOString(),
  },
];
