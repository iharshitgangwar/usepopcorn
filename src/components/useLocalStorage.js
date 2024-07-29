import { useEffect, useState } from "react";
export function useLocalStorage(initialState, key) {
     const [value, setvalue] =
          useState(function () {
               const AllData = localStorage.getItem(key);
               console.log(AllData)
               return AllData ? JSON.parse([AllData]) : initialState;
          });
     useEffect(function () {
          localStorage.setItem(key, JSON.stringify(value));
     }, [value])
     return [value, setvalue]
};