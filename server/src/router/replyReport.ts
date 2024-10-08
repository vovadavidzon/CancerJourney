import { Router } from "express";

import { addReplyReport } from "../controllers/replyReport";
import { mustAuth } from "../middleware/auth";
import { validate } from "../middleware/validator";
import { ReplyReportSchema } from "../utils/validationSchema";

const router = Router();

router.post(
  "/add-reply-report",
  mustAuth,
  validate(ReplyReportSchema),
  addReplyReport
);

export default router;
