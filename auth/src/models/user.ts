import mongoose from "mongoose";
import { isJsxAttributes } from "typescript";

// An interface that describe the properties that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

User.build({
  email: "test@test.com",
  password: "password",
});

// This step is to make sure that the typescript compiler will check the properties of the object that we are trying to create
// So we will be using User.buildUser() instead of new User() directly to create users in the future in this application.

export { User };
