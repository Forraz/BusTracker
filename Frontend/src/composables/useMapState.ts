import { ref } from "vue";
import { LatLng } from "leaflet";
import { type Coordinates } from "../api/schema.ts";

export interface Marker {

	id: string,
	position: Coordinates

}

class MapState {

	position = ref(new LatLng(0, 0));
	zoom = ref(18);
	markers = ref<Marker[]>([]);

	setPosition(val: LatLng) {

		this.position.value = val;

	}

	setZoom(val: number) {

		this.zoom.value = val;

	}

	addMarker(marker: Marker) {

		this.markers.value = [...this.markers.value, marker] 

	}

	removeMarker(id: string) {

		this.markers.value = this.markers.value.filter((marker) => marker.id != id);

	}

	clearMarkers() {

		this.markers.value = [];

	}

}

export function useMapState() {

	return new MapState();

}
