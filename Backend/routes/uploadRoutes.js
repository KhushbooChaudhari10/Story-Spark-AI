const express = require("express");
const multer = require("multer");
const { uploadDrawing, getChildDrawings, getDrawingsByChildId } = require("../controllers/uploadController");
//const { verifyToken } = require("../middleware/authMiddleware"); 

const router = express.Router();

// Use memory storage for file
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST /api/upload
router.post("/", upload.single("drawing"), uploadDrawing);

// 👩 Parent: get all child drawings
router.get("/children/:parentId", getChildDrawings);

// ✅ Get all drawings for a specific child
//router.get("/child/:childId", verifyToken, getChildDrawings);

router.get("/child/:childId", getDrawingsByChildId);


module.exports = router;
