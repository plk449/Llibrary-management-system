import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Biography', 'History', 'Self-help', 'Poetry', 'Engineering', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    required: true,
  },
  isbn: {   // The ISBN number, often unique for each book
    type: String,
    required: true,
    unique: true,
  },
  publisher: String,
  publishedDate: Date,
  description: String,
  coverImage: {
        type: String,
        // required:true
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 0,
  },
  totalCopiesAvailable: {
    type: Number,
    // required: true,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
}
  // category: {
  //   type: String  
  // },
},
{
    timestamps: true
});
export default mongoose.model('Book', bookSchema);
