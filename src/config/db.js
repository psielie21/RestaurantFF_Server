import mongoose from "mongoose";

import constants from "./constants";

mongoose.connect(constants.DB_URL);

mongoose.connection
    .once("open", () => console.log("Running"))
    .on("error", console.error.bind(console, 'connection error:'));



