import { App } from "./app.js";
import { Database } from "./db/client.js";
import { GTFSRtStore } from "./gtfs/gtfs-rt.store.js";

const database = new Database();
const gtfsRtProvider = new GTFSRtStore();

const app = new App(database, gtfsRtProvider);

app.start();
