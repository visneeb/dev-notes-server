import {
  registerService,
  loginService,
  getUserService,
  resetPasswordService,
} from "../services/authService.mjs";

export const registerController = async (req, res) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: "An error occurred during login" });
  }
};

export const getUserController = async (req, res) => {
  try {
    const result = await getUserService(req);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPasswordService(req);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
