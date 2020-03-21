const mongoose = require("mongoose");
const { USERNAME_EXISTS, INVALID_AUTH } = require("../constants/errorCodes");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { signJwt } = require("../authentication/authUtils");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 40
  },
  username: {
    type: String,
    required: true,
    max: 15
  },
  email: {
    type: String,
    required: true,
    max: 30
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  friend_requests: {
    inbox: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    sent: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  }
});

UserSchema.pre("save", async function(next) {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);

  if (this.isModified("username")) {
    const user = await UserModel.findOne({
      username: this.username
    });

    if (user) throw new Error(USERNAME_EXISTS);
  }

  this.token = signJwt(this._id);

  next();
});

UserSchema.pre("findOneAndUpdate", async function(next) {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 10);
  }

  if (this._update.username) {
    const user = await UserModel.findOne({
      username: this._update.username
    });

    if (user) throw new Error(USERNAME_EXISTS);
  }

  next();
});

UserSchema.statics.authenticate = async (username, password) => {
  const user = await UserModel.findOne({
    username: username
  });

  const errorMessage = INVALID_AUTH;

  if (!user) throw new Error(errorMessage);
  else if (!bcrypt.compareSync(password, user.password))
    throw new Error(errorMessage);

  user.token = signJwt(user._id);
  user.save();

  return user;
};

UserSchema.statics.add = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $push: {
        "friend_requests.sent": friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $push: {
        "friend_requests.inbox": myId
      }
    }
  );

  return user;
};

UserSchema.statics.accept = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $push: {
        friends: friendId
      },
      $pull: {
        "friend_requests.inbox": friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $push: {
        friends: myId
      },
      $pull: {
        "friend_requests.sent": myId
      }
    }
  );

  return user;
};

UserSchema.statics.unfriend = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $pull: {
        friends: friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $pull: {
        friends: myId
      }
    }
  );

  return user;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
