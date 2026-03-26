const express = require("express");
const router = express.Router();

const eventController = require("../controller/event.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/", auth, eventController.getEvents);


router.post(
    "/",
    auth,
    role("organizer"),
    eventController.createEvent
);

router.put("/:id", auth, eventController.updateEvent);


router.delete("/:id", auth, eventController.deleteEvent);

router.post("/:id/register", auth, eventController.registerEvent);

module.exports = router;