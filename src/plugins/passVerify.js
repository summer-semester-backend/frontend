export function complex(s)
{
  var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
  
  if (!pwdRegex.test(s)) {
      return false;
  }
  else
  return true;
}

export function isEmail(strEmail) {
  if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
  return true;
  else
  return false;
}