export const INITIAL_SHIFTS = {
  '1': { id: '1', name: 'الوردية الأولى (9ص - 5م)', start: '09:00', end: '17:00' },
  '2': { id: '2', name: 'الوردية الثانية (8:30ص - 5:30م)', start: '08:30', end: '17:30' },
  '3': { id: '3', name: 'الوردية الثالثة (9:30ص - 5:30م)', start: '09:30', end: '17:30' },
  '4': { id: '4', name: 'وردية رمضان (9ص - 3م)', start: '09:00', end: '15:00' }
};

export const getShiftByAny = (idOrName: string, shifts: any) => {
  if (shifts[idOrName]) return shifts[idOrName];
  return Object.values(shifts).find((s: any) => s.name === idOrName) || Object.values(shifts)[0];
};

export const calculateDeduction = (arrival: string, departure: string, empShiftId = '1', shifts = INITIAL_SHIFTS, rules: any = null, date: string | null = null) => {
  if (date) {
    const d = new Date(date);
    if (d.getDay() === 5 || d.getDay() === 6) {
      return { late: 0, early: 0, total: 0 };
    }
  }

  const shift = getShiftByAny(empShiftId, shifts);
  const [sH, sM] = shift.start.split(':').map(Number);
  const [eH, eM] = shift.end.split(':').map(Number);
  const shiftStartMinutes = sH * 60 + sM;
  const shiftEndMinutes = eH * 60 + eM;

  const activeRules = rules || {
    lateGracePeriod: 15,
    earlyDepartureGrace: 0,
    absencePenalty: 8,
    lateTiers: [
      { min: 16, max: 30, penalty: 0.5 },
      { min: 31, max: 60, penalty: 1 },
      { min: 61, max: 90, penalty: 1.5 },
      { min: 91, max: 120, penalty: 2 },
      { min: 121, max: 150, penalty: 3 },
      { min: 151, max: 180, penalty: 4 }
    ],
    earlyTiers: [
      { min: 1, max: 15, penalty: 0.5 },
      { min: 16, max: 30, penalty: 1 },
      { min: 31, max: 60, penalty: 1 },
      { min: 61, max: 90, penalty: 1.5 },
      { min: 91, max: 120, penalty: 2 },
      { min: 121, max: 150, penalty: 3 },
      { min: 151, max: 180, penalty: 4 }
    ]
  };

  let lateDeduction = 0;
  if (arrival) {
    const [h, m] = arrival.split(':').map(Number);
    const totalMinutes = h * 60 + m;
    const diff = totalMinutes - shiftStartMinutes;

    if (diff <= activeRules.lateGracePeriod) {
      lateDeduction = 0;
    } else {
      const tier = activeRules.lateTiers.find((t: any) => diff >= t.min && diff <= t.max);
      if (tier) {
        lateDeduction = tier.penalty;
      } else if (diff > 180) {
        lateDeduction = activeRules.absencePenalty;
      }
    }
  } else {
    lateDeduction = activeRules.absencePenalty;
  }

  let earlyDeduction = 0;
  if (departure) {
    const [h, m] = departure.split(':').map(Number);
    const totalMinutes = h * 60 + m;
    const diff = shiftEndMinutes - totalMinutes;

    if (diff > activeRules.earlyDepartureGrace) {
      const tier = activeRules.earlyTiers?.find((t: any) => diff >= t.min && diff <= t.max);
      if (tier) {
        earlyDeduction = tier.penalty;
      } else if (diff > 180) {
        earlyDeduction = activeRules.absencePenalty / 2;
      }
    }
  }
  
  return {
    late: lateDeduction,
    early: earlyDeduction,
    total: lateDeduction + earlyDeduction
  };
};

export const calculateDetailedAttendance = (arrival: string, departure: string, empShiftId = '1', shifts = INITIAL_SHIFTS, rules: any = null, date: string | null = null) => {
  if (date) {
    const d = new Date(date);
    if (d.getDay() === 5 || d.getDay() === 6) {
      const shift = getShiftByAny(empShiftId, shifts);
      const [eH, eM] = shift.end.split(':').map(Number);
      const shiftEndMin = eH * 60 + eM;

      if (!arrival || !departure) return { total: '0:00', late: '0.00', early: '0.00', ot: '0:00' };
      
      const [aH, aM] = arrival.split(':').map(Number);
      const [dH, dM] = departure.split(':').map(Number);
      const arrivalMin = aH * 60 + aM;
      const departureMin = dH * 60 + dM;

      const totalMin = Math.max(0, departureMin - arrivalMin);
      const totalHours = Math.floor(totalMin / 60);
      const totalMins = totalMin % 60;
      const totalStr = `${totalHours}:${totalMins.toString().padStart(2, '0')}`;

      let otMin = 0;
      if (departureMin > shiftEndMin) otMin = departureMin - shiftEndMin;
      const otHours = Math.floor(otMin / 60);
      const otMins = otMin % 60;
      const otStr = `${otHours}:${otMins.toString().padStart(2, '0')}`;

      return { total: totalStr, late: '0.00', early: '0.00', ot: otStr };
    }
  }

  if (!arrival || !departure) return { total: '0:00', late: '0.00', early: '0.00', ot: '0:00' };
  
  const shift = getShiftByAny(empShiftId, shifts);
  const [sH, sM] = shift.start.split(':').map(Number);
  const [eH, eM] = shift.end.split(':').map(Number);
  const shiftStartMin = sH * 60 + sM;
  const shiftEndMin = eH * 60 + eM;

  const [aH, aM] = arrival.split(':').map(Number);
  const [dH, dM] = departure.split(':').map(Number);
  const arrivalMin = aH * 60 + aM;
  const departureMin = dH * 60 + dM;

  const totalMin = Math.max(0, departureMin - arrivalMin);
  const totalHours = Math.floor(totalMin / 60);
  const totalMins = totalMin % 60;
  const totalStr = `${totalHours}:${totalMins.toString().padStart(2, '0')}`;

  const activeRules = rules || {
    lateGracePeriod: 15,
    earlyDepartureGrace: 15,
    absencePenalty: 1,
    lateTiers: [
      { min: 16, max: 30, penalty: 0.25 },
      { min: 31, max: 60, penalty: 0.5 },
      { min: 61, max: 120, penalty: 1 }
    ]
  };

  let late = 0;
  const lateDiff = arrivalMin - shiftStartMin;
  if (lateDiff > activeRules.lateGracePeriod) {
    late = lateDiff / 60;
  }

  let early = 0;
  const earlyDiff = shiftEndMin - departureMin;
  if (earlyDiff > activeRules.earlyDepartureGrace) {
    early = earlyDiff / 60;
  }

  let otMin = 0;
  if (departureMin > shiftEndMin) otMin = departureMin - shiftEndMin;
  const otHours = Math.floor(otMin / 60);
  const otMins = otMin % 60;
  const otStr = `${otHours}:${otMins.toString().padStart(2, '0')}`;

  return { total: totalStr, late: late.toFixed(2), early: early.toFixed(2), ot: otStr };
};
