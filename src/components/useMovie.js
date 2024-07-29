import { useState, useEffect } from "react";

export const useMovies = (query, callback) => {
     const KEY = '1e735c34'
     const [movies, setMovies] = useState([]);
     const fetchData = async () => {
          try {
               const responce = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
               const data = await responce.json();
               setMovies(data.Search);
          }
          catch (err) {
               console.error(err)
          }
     }

     useEffect(() => {
          callback?.()
          fetchData()
     }, [query])
     return { movies }
}