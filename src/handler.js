const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    if(!request.payload.hasOwnProperty('name')){
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = Number(pageCount) === Number(readPage);

    if(Number(readPage) > Number(pageCount)){
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);
      return response;
    }

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((books) => books.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

const getAllBookHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const booksData = books.filter((n) => n.id === bookId)[0];
   
   if (booksData !== undefined) {
      const response = h.response({
        status: 'success',
        data: {
          book: booksData,
        },
      });

      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    if(!request.payload.hasOwnProperty('name')){
      const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const finished = Number(pageCount) === Number(readPage);
    const updatedAt = new Date().toISOString();

    if(Number(readPage) > Number(pageCount)){
      const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);
      return response;
    }
   
    const index = books.findIndex((books) => books.id === bookId);
   
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        summary,
        author,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });

      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((books) => books.id === bookId);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };