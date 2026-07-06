import express from "express"

import { stopRouter } from "./routers/stop.router.js";
import { GTFSApiService } from "./services/gtfs-api.service.js";


const app = express();
const port = 3000;

const gtfsApiService: GTFSApiService = GTFSApiService.instance;

app.use("/api/stop", stopRouter);

app.listen(port, () => {

	console.log(`Listening on port ${port}`);

});


