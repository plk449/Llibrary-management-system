import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Book from "../models/books.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/BookTransactionSchema.models.js"



// List all books
const getAllBooks = asyncHandler(async (req, res) => {
    console.log("pollll");
    const books = await Book.find({})
        .sort({ _id: -1 });
    // .populate("transactions")

    return res
        .status(200)
        .json(new ApiResponse(200, books, "Books retrieved successfully"))
})

// Add a new book
const createBook = asyncHandler(async (req, res) => {
    // console.log("pollll");
    const { title, author, genre, isbn, publisher, publishedDate, description, totalCopies, totalCopiesAvailable } = req.body;

    if (!title || !author || !genre || !isbn || !totalCopies) {
        throw new ApiError(400, "Title, Author, Genre, ISBN, TotalCopies all fields are required");
    }

    const createdbook = await Book.create({
        title,
        author,
        genre,
        isbn,
        publisher,
        publishedDate,
        description,
        totalCopies,
        totalCopiesAvailable: totalCopies
    });

    return res.status(201).json(new ApiResponse(201, createdbook, "Book created successfully"));
});

// search By Genre
const getBooksByGenre = asyncHandler(async (req, res) => {
    const { genre } = req.body;
    const books = await Book.find({ genre });

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, `No books found in genre: ${genre}`));
    }

    res.status(200).json(new ApiResponse(200, books, `Books in genre: ${genre}`));

});

// Search books by title using regex
const searchBooks = asyncHandler(async (req, res) => {
    const { title } = req.body;
    // console.log(title);
    if (!title) {
        return res.status(400).json(new ApiResponse(400, null, "Query parameter is required"));
    }

    const books = await Book.find({
        title: { $regex: title, $options: 'i' } // Case-insensitive search
    });

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No books found matching the query"));
    }

    res.status(200).json(new ApiResponse(200, books, "Books found"));
});

// Borrow a book
const borrowBook = asyncHandler(async (req, res) => {
    const { bookId,isbn } = req.body;

    // console.log(isbn)

    // if (!bookId) {
    //     return res.status(400).json({ message: "bookId is required." });
    // }

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required." });
    }

    // Check if the book exists
    // const book = await Book.findById(bookId);
    const book = await Book.findOne({isbn});
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // console.log(book);
    // console.log(book._id);

    // Check if the book is available
    if (book.totalCopiesAvailable < 1) {
        throw new ApiError(400, "No copies of the book are available");
    }


    // Check if the user has already borrowed the book
    const existingTransaction = await Transaction.findOne({
        userId: req.user?._id,
        bookId: book._id,
        isReturned: false // Ensure the book hasn't been returned yet
    });

    if (existingTransaction) {
        throw new ApiError(400, "You have already borrowed this book");
    }

    // Create the transaction
    const transaction = new Transaction({
        userId: req.user?._id,
        bookId: book._id,
        // bookId,
        borrowDate: new Date(),
        isReturned: false,
    });
    await transaction.save();

    // Update the totalCopiesAvailable
    book.totalCopiesAvailable -= 1;
    await book.save();

    return res.status(201).json(new ApiResponse(201, transaction, "Book borrowed successfully"));
});

// Return a book
const returnBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({
        userId: req.user?._id,
        bookId,
        isReturned: false
    });

    if (!transaction) {
        throw new ApiError(404, "Active transaction not found for this book and user");
    }

    // Mark the transaction as returned
    transaction.isReturned = true;
    transaction.returnDate = new Date();
    await transaction.save();

    // Update the book's totalCopiesAvailable
    const book = await Book.findById(bookId);
    if (!book) throw new ApiError(404, "Book not found");

    book.totalCopiesAvailable = Math.min(book.totalCopies, book.totalCopiesAvailable + 1);
    await book.save();

    return res.status(200).json(new ApiResponse(200, transaction, "Book returned successfully"));
});

// Get transaction history by user
const getTransactionHistoryByUser = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user?._id }).populate('bookId', 'title author');
    if (transactions.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No transactions found for this user"));
    }
    return res.status(200).json(new ApiResponse(200, transactions, "Transaction history retrieved successfully"));
});


export {
    getAllBooks,
    createBook,
    getBooksByGenre,
    searchBooks,
    borrowBook,
    returnBook,
    getTransactionHistoryByUser
};