import fs from "node:fs";

import { GTFSImporter } from "../src/gtfs/gtfs.importer.js";
import { Database } from "../src/db/client.js";
import { unzip } from "../src/utils/unzip.js";
import { logger } from "../src/utils/logger.js";


const database = new Database();
const gtfsImporter = new GTFSImporter(database);

const archivePath = process.argv[2];

async function main() {

    const tempDirPath = "./temp_data/"

    await fs.mkdir(tempDirPath, err => {

        if (err) {
            
            logger.error({ err }, "Failed to create a temporary data dir");
            return;

        } else {    

            logger.info({ path: tempDirPath}, "Creating a temporary data dir");

        }

    });
    
    await unzip(archivePath, tempDirPath);
    await gtfsImporter.loadData(tempDirPath);

    await fs.rm(tempDirPath, { recursive: true, force: true }, err => {

        if (err) {
            
            logger.error({ err }, "Failed to remove a temporary data dir");

        } else {    

            logger.info({ path: tempDirPath}, "Removing a temporary data dir");

        }

    });

}

main();
