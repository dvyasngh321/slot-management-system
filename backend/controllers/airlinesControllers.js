const Airline = require("../models/Airlines");

exports.createAirlines = async (req, res) => {
  try {
    const { airlineName } = req.body;

    if (!airlineName) {
      return res.status(400).json({
        message: "Airline name is required",
      });
    }

    const airline = new Airline({ airlineName });
    await airline.save();

    return res.status(201).json({
      message: "Airlines added successfully",
      data: airline,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Airline Name already exists",
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};
