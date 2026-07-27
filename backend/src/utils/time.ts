const WIB_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7

/**
 * Get current time in WIB (Asia/Jakarta) as a plain Date object
 */
export const nowWIB = (): Date => {
  return new Date(Date.now() + WIB_OFFSET_MS);
};

/**
 * Given a booking date string (YYYY-MM-DD), returns the deadline for placing a booking:
 * H-1 at 15:00 WIB.
 * If now (WIB) is past 15:00, the earliest bookable date is H+2 (not H+1).
 */
export const isValidBookingTime = (bookingDate: Date, currentTime: Date): boolean => {
  // Convert current time to WIB epoch
  const currentWIBMs = currentTime.getTime() + WIB_OFFSET_MS;
  const currentWIBDate = new Date(currentWIBMs);

  // H-1 deadline: the day before booking at 15:00 WIB
  // bookingDate is a UTC midnight date; treat its date parts as WIB date
  const limitDate = new Date(bookingDate);
  limitDate.setUTCDate(limitDate.getUTCDate() - 1);
  limitDate.setUTCHours(8, 0, 0, 0); // 15:00 WIB = 08:00 UTC

  return currentTime <= limitDate;
};

/**
 * Returns the earliest bookable tanggal_booking given the current WIB time.
 * If now WIB is past 15:00 → earliest is H+2 (tomorrow is already locked)
 * Otherwise → earliest is H+1
 */
export const getEarliestBookableDate = (): Date => {
  const utcNow = new Date();
  const wibHour = new Date(utcNow.getTime() + WIB_OFFSET_MS).getUTCHours();

  const earliest = new Date(utcNow);
  earliest.setUTCHours(0, 0, 0, 0);
  // Add 1 day by default; if past 15:00 WIB, add 2
  earliest.setUTCDate(earliest.getUTCDate() + (wibHour >= 15 ? 2 : 1));
  return earliest;
};

/**
 * Checks if cancellation/reschedule is still allowed:
 * At least 4 hours before the slot's start time on the booking date.
 * slotStartTime is a DateTime with only time component (from DB @db.Time)
 */
export const isCancelOrRescheduleAllowed = (
  tanggalBooking: Date,
  slotStartTime: Date,
  currentTime: Date
): boolean => {
  // Combine booking date + slot start time to get absolute start datetime (UTC)
  const slotDateTime = new Date(tanggalBooking);
  slotDateTime.setUTCHours(
    slotStartTime.getUTCHours(),
    slotStartTime.getUTCMinutes(),
    0,
    0
  );

  const fourHoursMs = 4 * 60 * 60 * 1000;
  return slotDateTime.getTime() - currentTime.getTime() > fourHoursMs;
};

/**
 * Checks if check-in is out of tolerance (early/late > 30 mins)
 */
export const isOutOfTolerance = (
  tanggalBooking: Date,
  slotStartTime: Date,
  actualTime: Date
): boolean => {
  const slotDateTime = new Date(tanggalBooking);
  slotDateTime.setUTCHours(
    slotStartTime.getUTCHours(),
    slotStartTime.getUTCMinutes(),
    0,
    0
  );

  const diffMinutes = (actualTime.getTime() - slotDateTime.getTime()) / (1000 * 60);
  return diffMinutes < -30 || diffMinutes > 30;
};

/**
 * Calculates turnaround time (lead time) in minutes between ATA (Arrived at Gate) and Checkout.
 */
export const calculateTurnaroundTime = (ata: Date, checkout: Date): number => {
  const diffMs = checkout.getTime() - ata.getTime();
  return Math.max(0, diffMs / (1000 * 60)); // in minutes
};
