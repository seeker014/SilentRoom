import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({ 
    nickname: { type: String, required: true }, 
    password: { type: String, required: true }, 
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
 }, 
 { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if user updates something else than password , then don't hash the password.

  try {
    const salt = await bcrypt.genSalt(10); //
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } 
  catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

export default mongoose.model('User', userSchema);
