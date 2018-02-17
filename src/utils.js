export const parseTime = time => {
  if (typeof time === 'number') {
    return time
  }

  const parts = time.split(':')

  let seconds = 0
  if (parts.length > 0) {
    // Float, because seconds can be '1.3'
    seconds += parseFloat(parts.pop(), 10)
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop(), 10) * 60
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop(), 10) * 3600
  }

  return seconds
}
