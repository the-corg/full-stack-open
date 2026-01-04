import { BOOK_DETAILS } from '../queries';

export const addBookToCache = (cache, addBook) => {
  cache.modify({
    fields: {
      allGenres(existingGenres = []) {
        const newGenres = addBook.genres.filter(g => !existingGenres.includes(g));
        return [...existingGenres, ...newGenres].sort();
      },

      allBooks(existingBookRefs = [], { args }) {
        if (args?.genre && !addBook.genres.includes(args.genre)) return existingBookRefs;

        const newBookRef = cache.writeFragment({
          data: addBook,
          fragment: BOOK_DETAILS,
        });

        if (existingBookRefs.some(ref => cache.identify(ref) === cache.identify(addBook)))
          return existingBookRefs;

        return [...existingBookRefs, newBookRef];
      },
    },
  });
};
