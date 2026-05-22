import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {

    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      // "  Nova  " becomes "Nova"
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },


    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    glyphHash: {
      type: String,
      required: [true, 'Glyph sequence is required'],
      // This stores the HASHED version of the star sequence.
      // The raw sequence "3-7-1-11-5" gets hashed to something like "$2b$12$xyz..." by bcrypt.
    },

    // glyphStarIds
    glyphStarIds: {
      type: [Number],
      required: true,
    },

    //  loginCount 
    loginCount: {
      type: Number,
      default: 0,

    },

    // lastLogin 
    lastLogin: {
      type: Date,

    },
  },

  {
    timestamps: true,
    //   createdAt — set once when the document is first created
    //   updatedAt — updated automatically every time the document is saved
  
  }
);


// This is like a security guard that intercepts every save.
// It hashes the glyphHash field before it reaches MongoDB.

userSchema.pre('save', async function () {
  if (!this.isModified('glyphHash')) return;

  const salt = await bcrypt.genSalt(12);
  this.glyphHash = await bcrypt.hash(this.glyphHash, salt);
});


userSchema.methods.compareGlyph = async function (candidateSequence) {


  return bcrypt.compare(candidateSequence, this.glyphHash);

};


const User = mongoose.model('User', userSchema);


export default User;
