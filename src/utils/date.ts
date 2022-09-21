import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from "dayjs/plugin/minMax";
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);
dayjs.extend(minMax);

export type DateType = string | number | dayjs.Dayjs | Date | undefined;

export const enum DateFormatOption {
  'MONTH_WISE' = 'MM/DD/YYYY',
  'DATE_WISE' = 'DD/MM/YYYY',
  'YEAR_WISE' = 'YYYY/MM/DD'
}

export const today = dayjs(new Date()).format('YYYY-MM-DD')
export const tomorrow = dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD')
export const LastThirtyDays: Dayjs = dayjs.utc().subtract(30, 'day')
export const utcNow = () => dayjs.utc().toISOString();
export const utcToLocalTimeFormat = (date: string) => dayjs.utc(date).local().format('LT');
export const utcToLocalDateFormat = (date: string) => dayjs.utc(date).local().format('LL');
export const utcIsToday = (date: string) => dayjs.utc(date).local().isToday();
export const utcIsYesterday = (date: string) => dayjs.utc(date).local().isYesterday();
export const todayIsSameOrAfter = (date: string) => dayjs().isSameOrAfter(dayjs(date));
export const dateISOFormat = (date: string) => new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000).toISOString()
export const utcFromNow = (date: string) => dayjs.utc(date).fromNow();
export const utcToUnix = (date: string) => dayjs.utc(date).unix();
export const formattedDate = (date: DateType) => {
	return dayjs(date ?? new Date()).format('L')
}
export const maxDate = (dates: DateType[]) => {
	// DayJS v1.9.4+ bug => min/max returns different results on passing spread vs array
	// https://github.com/iamkun/dayjs/issues/1269
	const mappedDates = dates.map((date) => dayjs(date));
	return dayjs.max(mappedDates).format('L');
}
export const minDate = (dates: DateType[]) => {
	// DayJS v1.9.4+ bug => min/max returns different results on passing spread vs array
	// https://github.com/iamkun/dayjs/issues/1269
	const mappedDates = dates.map((date) => dayjs(date));
	return dayjs.min(mappedDates).format('L');
}
export const newDate = (date: DateType) => {
	return formattedDate(date);
}
export const isAfter = (date: DateType, refereneDate: DateType): boolean => {
	const dayJsDate = formattedDate(date);
	const dayJsReferenceDate = formattedDate(refereneDate);
	return dayjs(dayJsDate).isAfter(dayJsReferenceDate);
}
export const isBefore = (date: DateType, refereneDate: DateType): boolean => {
	const dayJsDate = formattedDate(date);
	const dayJsReferenceDate = formattedDate(refereneDate);
	return dayjs(dayJsDate).isBefore(dayJsReferenceDate);
}

export const isSame = (date: DateType, refereneDate: DateType): boolean => {
	const dayJsDate = formattedDate(date);
	const dayJsReferenceDate = formattedDate(refereneDate);
	return dayjs(dayJsDate).isSame(dayJsReferenceDate);
}
export const fixedPointHours = (hours: DateType) => {
	return String(hours).toFixedNumber();
}

export const formatDateBy = (date: DateType, formatOption: DateFormatOption): DateType => {
	return dayjs(date).format(formatOption);
}

// export const LastThirtyDays: string = moment()
//     .utcOffset(0)
//     .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
//     .subtract(32, 'days').toISOString()
