import dayjs from "dayjs";

export const parseTimeToDate = (timeString) => dayjs(timeString).toDate();

export const formatTimeRange = (start, end) => `${dayjs(start).format("HH:mm")} - ${dayjs(end).format("HH:mm")}`;
