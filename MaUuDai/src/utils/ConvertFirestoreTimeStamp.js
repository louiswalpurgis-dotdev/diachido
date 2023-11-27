import { differenceInDays } from 'date-fns';

const convertFirestoreTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const convertFirestoreTimestampToTime = (timestamp) => {
    const Day = convertFirestoreTimestamp(timestamp);
    const date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${Day} ${hour}:${minute}`;
};

const calculateTimeRemaining = (startTime, endTime) => {
    // Chuyển đổi startTime và endTime thành định dạng ngày tháng
    const startDate = startTime.toDate();
    const endDate = endTime.toDate();
    return differenceInDays(endDate, startDate);
};
export { convertFirestoreTimestampToTime, calculateTimeRemaining };

export default convertFirestoreTimestamp;
