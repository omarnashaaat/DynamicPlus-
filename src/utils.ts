import { INITIAL_SHIFTS } from './constants';

export const getShiftByAny = (idOrName: string, shifts: any = INITIAL_SHIFTS) => {
    if (shifts[idOrName]) return shifts[idOrName];
    return Object.values(shifts).find((s: any) => s.name === idOrName) || Object.values(shifts)[0];
};

export const calculateDeduction = (arrival: string, departure: string, empShiftId: string = '1', shifts: any = INITIAL_SHIFTS) => {
    const shift = getShiftByAny(empShiftId, shifts);
    const [sH, sM] = shift.start.split(':').map(Number);
    const [eH, eM] = shift.end.split(':').map(Number);
    const shiftStartMinutes = sH * 60 + sM;
    const shiftEndMinutes = eH * 60 + eM;

    let lateDeduction = 0;
    if (arrival) {
        const [h, m] = arrival.split(':').map(Number);
        const totalMinutes = h * 60 + m;
        const diff = totalMinutes - shiftStartMinutes;

        if (diff <= 15) lateDeduction = 0;
        else if (diff <= 30) lateDeduction = 0.25;
        else if (diff <= 60) lateDeduction = 0.5;
        else if (diff <= 120) lateDeduction = 1;
        else if (totalMinutes <= 12 * 60) lateDeduction = 4; // Half day
        else lateDeduction = 8; // Full day
    }

    let earlyDeduction = 0;
    if (departure) {
        const [h, m] = departure.split(':').map(Number);
        const totalMinutes = h * 60 + m;
        const diff = shiftEndMinutes - totalMinutes;

        if (diff <= 0) earlyDeduction = 0;
        else if (diff <= 15) earlyDeduction = 0.25;
        else if (diff <= 60) earlyDeduction = 0.5;
        else if (diff <= 120) earlyDeduction = 1;
        else if (totalMinutes >= shiftEndMinutes - 240) earlyDeduction = 4; // Half day
        else earlyDeduction = 8; // Full day
    }
    return lateDeduction + earlyDeduction;
};

export const calculateDetailedAttendance = (arrival: string, departure: string, empShiftId: string = '1', shifts: any = INITIAL_SHIFTS) => {
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

    let late = 0;
    if (arrivalMin > shiftStartMin) late = (arrivalMin - shiftStartMin) / 60;

    let early = 0;
    if (departureMin < shiftEndMin) early = (shiftEndMin - departureMin) / 60;

    let otMin = 0;
    if (departureMin > shiftEndMin) otMin = departureMin - shiftEndMin;
    const otHours = Math.floor(otMin / 60);
    const otMins = otMin % 60;
    const otStr = `${otHours}:${otMins.toString().padStart(2, '0')}`;

    return { total: totalStr, late: late.toFixed(2), early: early.toFixed(2), ot: otStr };
};
