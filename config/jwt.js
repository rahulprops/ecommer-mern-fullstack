import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  try {
    // Generate the JWT token
    const token = jwt.sign({ userId }, process.env.JWT, {
      expiresIn: "1d",
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    throw new Error(`Failed to generate token ${error}`);
  }
};
