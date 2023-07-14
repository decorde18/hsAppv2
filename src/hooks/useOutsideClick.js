import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();
  function handleClick(e) {
    if (ref.current && !ref.current.contains(e.target)) handler();
  }
  useEffect(
    function () {
      document.addEventListener("click", handleClick, listenCapturing); //the true keeps the modal from closing immediately when opening
      return () => document.removeEventListener("click", handleClick);
    },
    [handler, listenCapturing]
  );
  return ref;
}
