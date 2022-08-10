export function complex(s)
{
  var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
  
  if (!pwdRegex.test(s)) {
      return false;
  }
  else
  return true;
}