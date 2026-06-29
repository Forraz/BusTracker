import express from "express"

import { OVApiDataUpdater } from "./services/ovapi.service.js"
import stopRouter from "./routers/stop.router.js";

const app = express();
const port = 3000;

// const updater = new OVApiDataUpdater([
// 	"https://gtfs.ovapi.nl/nl/tripUpdates.pb",
// 	"https://gtfs.ovapi.nl/nl/vehiclePositions.pb"
// ]);
//

app.use("/api/stop", stopRouter);

app.listen(port, () => {

	console.log(`Listening on port ${port}`);

});

