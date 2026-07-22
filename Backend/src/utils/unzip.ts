import * as unzipper from "unzipper";

export async function unzip(zipPath: string, outputDir: string) {

	console.log(`Unzipping: ${zipPath}`);

	const directory = await unzipper.Open.file(zipPath);
	await directory.extract({ path: outputDir});

	console.log(`Finished unzipping: ${zipPath}`);

}
