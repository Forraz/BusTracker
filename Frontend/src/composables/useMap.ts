import { inject } from "vue";
import { MapState } from "./useMapState";

export function useMap(): MapState | null {

	const map: MapState | undefined = inject("map");

	// if (!map) {
	//
	// 	console.
	//
	// }

	return map || null;

}
