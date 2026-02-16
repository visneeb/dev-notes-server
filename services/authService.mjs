import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export const registerService = async ({ email, password, username, name }) => {
  const usernameCheckQuery = `
      SELECT * FROM users
      WHERE username = $1
    `;
  const usernameCheckValues = [username];

  const { rows: existingUser } = await connectionPool.query(
    usernameCheckQuery,
    usernameCheckValues,
  );

  if (existingUser.length > 0) {
    const err = new Error("This username is already taken");
    err.status = 400;
    throw err;
  }

  const { data, error: supabaseError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (supabaseError) {
    if (supabaseError.code === "user_already_exists") {
      const err = new Error("User with this email already exists");
      err.status = 400;
      throw err;
    }

    const err = new Error("Failed to create user. Please try again.");
    err.status = 400;
    throw err;
  }

  const supabaseUserId = data.user.id;

  const query = `
      INSERT INTO users (id, username, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  const values = [supabaseUserId, username, name, "user"];

  const { rows } = await connectionPool.query(query, values);

  return {
    message: "User created successfully",
    user: rows[0],
  };
};

export const loginService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.includes("Invalid login credentials")
    ) {
      const err = new Error(
        "Your password is incorrect or this email doesn't exist",
      );
      err.status = 400;
      throw err;
    }

    const err = new Error(error.message);
    err.status = 400;
    throw err;
  }

  return {
    message: "Signed in successfully",
    access_token: data.session.access_token,
  };
};

export const getUserService = async (req) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const err = new Error("Unauthorized: Token missing");
    err.status = 401;
    throw err;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    const err = new Error("Unauthorized or token expired");
    err.status = 401;
    throw err;
  }

  const supabaseUserId = data.user.id;

  const query = `
      SELECT * FROM users
      WHERE id = $1
    `;
  const values = [supabaseUserId];

  const { rows } = await connectionPool.query(query, values);

  return {
    id: data.user.id,
    email: data.user.email,
    username: rows[0].username,
    name: rows[0].name,
    role: rows[0].role,
    profilePic: rows[0].profile_pic,
  };
};

export const resetPasswordService = async (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    const err = new Error("Unauthorized: Token missing");
    err.status = 401;
    throw err;
  }

  if (!newPassword) {
    const err = new Error("New password is required");
    err.status = 400;
    throw err;
  }

  const { data: userData } = await supabase.auth.getUser(token);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: oldPassword,
  });

  if (loginError) {
    const err = new Error("Invalid old password");
    err.status = 400;
    throw err;
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    const err = new Error(error.message);
    err.status = 400;
    throw err;
  }

  return { message: "Password updated successfully" };
};
