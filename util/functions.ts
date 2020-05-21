import Swal from "sweetalert2";

/**
 * Capitalize a String
 *
 * @param s - String to capitalize
 */
export const capitalize = (s: String): String => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Sleep Function
 *
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

/**
 * Return a Swal toast in the bottom-right
 */
export function getToast() {
  return Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

/**
 * Returns a boolean based on whether or not a date of birth is valid
 *
 * @param dateOfBirth
 */
export function checkDateOfBirth(dateOfBirth: string) {
  var err = false;
  var year = new Date(dateOfBirth);
  var year2 = year.getFullYear();
  var date = new Date().getFullYear();
  var dif = year2 - date;
  if (dif < -100 || dif > 0) {
    err = true;
  }
  if (err) {
    return true;
  } else {
    return false;
  }
}
