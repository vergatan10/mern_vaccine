const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const Schema = mongoose.Schema;

const vaccineLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    vaccinated: {
      type: Number,
      required: true,
      defualt: 0,
    },
    vaccine: {
      type: Schema.Types.ObjectId,
      ref: "Vaccine",
      required: true,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("VaccineLot", vaccineLotSchema);
