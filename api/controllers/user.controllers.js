import User from "../models/user.model.js";
import { errorHandler } from "../Utiles/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.send("api test route");
};

export const updateUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "You are not authorized to access this resource")
    );

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username, // corrected to match input name
          email: req.body.email,
          password: req.body.password,
          photo: req.body.photo,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "You are not authorized to access this resource")
    );

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async(req,res,next)=>{
  if(req.user.id === req.params.id){
    try {
      const listings = await Listing.find({userRef:req.params.id});
      res.status(200).json(listings);
    } catch (error) {
      next(error)
    }
  }else{
    return next(errorHandler(401,'You can only view your own listing!'))
  }
}