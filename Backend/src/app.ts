import express from "express"

import { OVApiDataUpdater } from "./services/ovapi.service.js"

const app = express();
const port = 3000;

const updater = new OVApiDataUpdater([
	"https://gtfs.ovapi.nl/nl/tripUpdates.pb",
	"https://gtfs.ovapi.nl/nl/vehiclePositions.pb"
]);

app.listen(port, () => {

	console.log(`Listening on port ${port}`);

});

