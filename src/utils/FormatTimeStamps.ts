import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function formatTimestamp(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  }

  const diffMinutes = (Date.now() - date.getTime()) / 60000;
  if (diffMinutes < 60 * 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Older → full date
  return format(date, 'MMM d, HH:mm');
}
