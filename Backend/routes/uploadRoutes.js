const express = require("express");
const multer = require("multer");
const { uploadDrawing, getChildDrawings, getDrawingsByChildId } = require("../controllers/uploadController");
//const { verifyToken } = require("../middleware/authMiddleware"); 

const router = express.Router();

// using memory storage keeps file handling faster for small child drawings
// no temporary disk write → cleaner + reduces filesystem overhead
const storage = multer.memoryStorage();
const upload = multer({ storage });

// children drawings are uploaded frequently, so handling this endpoint lightweight + fast is important
router.post("/", upload.single("drawing"), uploadDrawing);

// this endpoint gives parents visibility over all children they manage
// parent UI needs aggregated view to monitor each child's progress/creativity
router.get("/children/:parentId", getChildDrawings);

// child dashboard needs this specific endpoint so each child only sees their own gallery
router.get("/child/:childId", getDrawingsByChildId);

module.exports = router;
