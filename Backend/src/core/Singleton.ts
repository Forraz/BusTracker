
export class Singleton {

	static _instance: any;

	protected constructor() {}

	public static get instance() {

		if (this._instance == null) {

			this._instance = new this();

		}

		return this._instance;

	}

}
