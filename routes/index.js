import express from "express";
import debug from "../modules/debug.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("../views/home.handlebars", {});
});

export default router;
