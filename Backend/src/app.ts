import express from "express"

import { stopRouter } from "./routers/stop.router.js";
import { GTFSApiService } from "./services/gtfs-api.service.js";
import { GTFSRtService } from "./services/gtfs-rt.service.js";
import { tripRouter } from "./routers/trip.router.js";
import { handleErrors } from "./middleware/handleErrors.js";
import { routeRouter } from "./routers/route.router.js";


const app = express();
const port = 3000;

const gtfsApiService: GTFSApiService = GTFSApiService.instance;
const gtfsRtService: GTFSRtService = GTFSRtService.instance;

app.use("/api/stops", stopRouter);
app.use("/api/trips", tripRouter)
app.use("/api/routes", routeRouter)
app.use(handleErrors);

app.listen(port, () => {

	console.log(`Listening on port ${port}`);

});


