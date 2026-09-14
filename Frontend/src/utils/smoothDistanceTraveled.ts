export class SmoothDistanceTraveled {

	constructor(
		public distanceTraveled: number,
		public speed: number
	) {}

	update(deltaTime: number) {

		this.distanceTraveled += this.speed * deltaTime;

	}

	correct(correctDistanceTraveled: number, deltaTime: number) {

		const error = correctDistanceTraveled - this.distanceTraveled;

		const distanceTraveledCorrectionStrength = 0.1;
		const speedCorrectionStrength = 0.15;

		this.distanceTraveled += distanceTraveledCorrectionStrength * error;
		this.speed += speedCorrectionStrength * error / deltaTime;

	}

	getValue() {

		return this.distanceTraveled;

	}

}
