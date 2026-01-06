const CounterApplication = require("../models/CounterApplication");
const SlotRequest = require("../models/SlotRequest");

exports.applyForCounters = async (req, res, next) => {
  try {
    const { slotApprovalId } = req.body;

    const slot = await SlotRequest.findOne({
      _id: slotApprovalId,
    });

    if (!slot)
      return res.status(404).json({ message: "Approved slot not found." });

    // prevent duplicate applications for same slot
    const existing = await CounterApplication.findOne({ slotApprovalId });
    if (existing)
      return res
        .status(409)
        .json({ message: "Counter application already exists for this slot." });

    const app = await CounterApplication.create({
      slotApprovalId,
      user: req.user,
      status: "submitted",
    });

    return res
      .status(201)
      .json({ message: "Counter application submitted.", data: app });
  } catch (err) {
    next(err);
  }
};

exports.getCountersApplication = async (req, res, next) => {
  try {
    const counterApplications = await CounterApplication.find({
      status: "submitted",
    }).populate({
      path: "slotApprovalId",
      populate: {
        path: "airlineId",
        select: "airlineName", // optional
      },
    });

    return res.status(200).json({
      data: counterApplications,
      message: "Applications for counters fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};
