import { error_logs } from "../middleware/error_log/error_log.js";

export const createProduct = async (req, res) => {
  try {
    console.log("create product");
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};
