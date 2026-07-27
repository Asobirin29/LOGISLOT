import { isValidBookingTime, isOutOfTolerance, calculateTurnaroundTime } from './time';

describe('Booking Time Validation', () => {
  it('should allow booking if current time is well before H-1 15:00', () => {
    const bookingDate = new Date('2023-10-25T08:00:00Z');
    const currentTime = new Date('2023-10-23T10:00:00Z'); // H-2
    expect(isValidBookingTime(bookingDate, currentTime)).toBe(true);
  });

  it('should allow booking if current time is exactly H-1 15:00', () => {
    const bookingDate = new Date('2023-10-25T08:00:00Z');
    // limit is 2023-10-24 15:00
    const currentTime = new Date('2023-10-24T15:00:00Z');
    expect(isValidBookingTime(bookingDate, currentTime)).toBe(false);
  });

  it('should reject booking if current time is after H-1 15:00', () => {
    const bookingDate = new Date('2023-10-25T08:00:00Z');
    // limit is 2023-10-24 15:00
    const currentTime = new Date('2023-10-24T15:01:00Z');
    expect(isValidBookingTime(bookingDate, currentTime)).toBe(false);
  });

  it('should reject booking if current time is on the same day as booking', () => {
    const bookingDate = new Date('2023-10-25T08:00:00Z');
    const currentTime = new Date('2023-10-25T07:00:00Z');
    expect(isValidBookingTime(bookingDate, currentTime)).toBe(false);
  });
});

describe('Check-In Tolerance', () => {
  const tanggalBooking = new Date('2023-10-25T00:00:00Z');
  const slotStartTime = new Date('1970-01-01T10:00:00Z');

  it('should return false (within tolerance) for exactly on time', () => {
    const actual = new Date('2023-10-25T10:00:00Z');
    expect(isOutOfTolerance(tanggalBooking, slotStartTime, actual)).toBe(false);
  });

  it('should return false (within tolerance) for 30 mins early', () => {
    const actual = new Date('2023-10-25T09:30:00Z');
    expect(isOutOfTolerance(tanggalBooking, slotStartTime, actual)).toBe(false);
  });

  it('should return false (within tolerance) for 30 mins late', () => {
    const actual = new Date('2023-10-25T10:30:00Z');
    expect(isOutOfTolerance(tanggalBooking, slotStartTime, actual)).toBe(false);
  });

  it('should return true (out of tolerance) for 31 mins early', () => {
    const actual = new Date('2023-10-25T09:29:00Z');
    expect(isOutOfTolerance(tanggalBooking, slotStartTime, actual)).toBe(true);
  });

  it('should return true (out of tolerance) for 31 mins late', () => {
    const actual = new Date('2023-10-25T10:31:00Z');
    expect(isOutOfTolerance(tanggalBooking, slotStartTime, actual)).toBe(true);
  });
});

describe('Turnaround Time', () => {
  it('should calculate correct minutes', () => {
    const ata = new Date('2023-10-25T10:00:00Z');
    const checkout = new Date('2023-10-25T11:30:00Z');
    expect(calculateTurnaroundTime(ata, checkout)).toBe(90);
  });

  it('should not return negative if checkout is before ata (fail-safe)', () => {
    const ata = new Date('2023-10-25T10:00:00Z');
    const checkout = new Date('2023-10-25T09:30:00Z');
    expect(calculateTurnaroundTime(ata, checkout)).toBe(0);
  });
});
