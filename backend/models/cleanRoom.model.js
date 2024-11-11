const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CleanRoomSchema = mongoose.Schema(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            // required: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            // required: true
        },
        status: {
            type: String,
        },
        lastUpdated: {
            type: Date,
            default: Date.now
          }
       
    },
    {
        timestamps: true,
    }
);

const CleanRoom = mongoose.model("CleanRoom", CleanRoomSchema);

module.exports = CleanRoom;