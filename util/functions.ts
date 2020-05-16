import Swal from "sweetalert2";
import { isEmpty } from "@aws-amplify/core";
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
 * Simple version of a validation function, checks all parts are present
 *
 * @param body - req.body
 * @param types - array of keys that should be present on req.body
 */
export const validateBody = (body: {}, types: string[]) => {
  var errors = [];

  types.forEach((type) => {
    var error = {};
    if (!body[type]) error["error"] = type + " is missing";

    if (!isEmpty(error)) errors.push(error);
  });

  if (!isEmpty(errors)) return errors;
};
