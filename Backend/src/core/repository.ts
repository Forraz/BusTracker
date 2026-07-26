import type { Database } from "../db/client.js";


export class Repository { 

	constructor(

		protected database: Database

	) {}

}
