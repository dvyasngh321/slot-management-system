const SlotRequest = require("../models/SlotRequest");
const { calculateHourlyCongestion } = require("../services/congestionService");

exports.getDailyCongestion = async (req, res, next) => {
  try {
    // Fetch only what you need
    const slots = await SlotRequest.find({
      status: "submitted",
    })
      .select("requestedArrivalTime requestedDepartureTime")
      .lean();

    console.log(slots);

    const congestion = calculateHourlyCongestion(
      slots.map((s) => ({
        requestedArrivalTime: s.requestedArrivalTime,
        requestedDepartureTime: s.requestedDepartureTime,
      }))
    );

    return res.json({
      congestion,
    });
  } catch (err) {
    next(err);
  }
};
