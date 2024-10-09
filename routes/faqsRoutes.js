const express = require("express");
const {
  AddFaqs,
  FetchFaqs,
  DeleteFaq,
  UpdateFaq,
  getFaqById,
} = require("../controllers/faqsController");
const router = express.Router();

// POST request to add multiple FAQs
router.post("/faqs/add-faqs", AddFaqs);
router.get("/faqs/get-faqs", FetchFaqs);
router.delete("/faqs/delete-faq/:id", DeleteFaq);
router.put("/faqs/update-faq/:id", UpdateFaq);
router.get("/faqs/get-faq/:id", getFaqById);

module.exports = router;
