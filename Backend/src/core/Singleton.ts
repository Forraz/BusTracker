
export class Singleton {

	static #instance: Singleton;

	protected constructor() {}

	public static get instance() {

		if (Singleton.#instance == null) {

			Singleton.#instance = new Singleton();

		}

		return Singleton.#instance;

	}

}
