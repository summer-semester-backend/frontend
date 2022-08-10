export function formatDate(dateStr) {
  if (!dateStr || dateStr == '') return '-';
  let tempDate = dateStr.split(':')[0] + ':' + dateStr.split(':')[1];
  tempDate = tempDate.replace('T', ' ');
  return tempDate;
}
