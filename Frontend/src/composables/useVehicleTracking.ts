import { ref } from "vue";

import tripService from "../api/services/trip.service.ts";

import { MovingVehicle } from "../utils/movingVehicle.ts";


export class VehicleTracking {

	movingVehicle = ref<MovingVehicle | null>(null);

    private lastTime: Date = new Date();
    private updateInterval: number = 0;
    private correctionInterval: number = 0;

    constructor(movingVehicle: MovingVehicle) {

        this.movingVehicle.value = movingVehicle;

    }

    start() {

        this.lastTime = new Date();

		this.updateInterval = setInterval(() => {

			const now = new Date();
			const deltaTime = (Number(now) - Number(this.lastTime)) / 1000;
			this.lastTime = now;

			this.updateMovingVehicle(deltaTime);

		}, 1000 / 60);

		this.correctionInterval = setInterval(() => {

			this.correctMovingVehicle();

		}, 1000 * 5);


    }

    stop() {

        clearInterval(this.updateInterval);
        clearInterval(this.correctionInterval);

    }

	updateMovingVehicle(deltaTime: number) {

		if (this.movingVehicle.value) {

			this.movingVehicle.value.update(deltaTime);

		}

	}

	async correctMovingVehicle() {

		if (this.movingVehicle.value) {

			 const vehicle = await tripService.getVehicleById(this.movingVehicle.value.data.tripId)!;

			 if (
                 vehicle != null &&
                 (vehicle.coordinates.lat != this.movingVehicle.value.data.coordinates.lat ||
                 vehicle.coordinates.lon != this.movingVehicle.value.data.coordinates.lon)
             ) {

				this.movingVehicle.value.data = vehicle;
				this.movingVehicle.value.correct(vehicle);

			}

		}

	}

}

export function useVehicleTracking(movingVehicle: MovingVehicle) {

    const vehicleTracking = new VehicleTracking(movingVehicle);

    return vehicleTracking;

}
