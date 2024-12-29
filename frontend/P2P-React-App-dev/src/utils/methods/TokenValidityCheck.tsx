import jwtDecode from "jwt-decode";
import moment from "moment";

interface DecodedToken {
  exp: number;
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    //console.log(decoded.exp);

    const expirationTime = moment.unix(decoded.exp);
    console.log(`expiration time: ${expirationTime}`);

    return moment().isBefore(expirationTime);
  } catch (error) {
    return false;
  }
}
