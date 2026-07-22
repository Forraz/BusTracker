import * as unzipper from "unzipper";
import { logger } from "./logger.js";

export async function unzip(zipPath: string, outputDir: string) {

	logger.info({ path: zipPath}, "Unzipping archive");

	const directory = await unzipper.Open.file(zipPath);
	await directory.extract({ path: outputDir});

	logger.info({ path: zipPath }, "Finished unzipping archive");

}
