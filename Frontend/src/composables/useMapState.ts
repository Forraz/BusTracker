import { ref } from "vue";
import { LatLng } from "leaflet";

export interface Marker {

	id: string,
	position: LatLng

}

export interface Polyline {

	id: string,
	parts: LatLng[]

}

export class MapState {

	// Amsterdam
	position = ref(new LatLng(52.37403, 4.88969));

	zoom = ref(18);
	markers = ref<Marker[]>([]);
	polylines = ref<Polyline[]>([]);

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

	addPolyline(polyline: Polyline) {

		this.polylines.value = [...this.polylines.value, polyline] 

	}

	removePolyline(id: string) {

		this.polylines.value = this.polylines.value.filter((polyline) => polyline.id != id);

	}

	clearPolylines() {

		this.polylines.value = [];

	}

}

export function useMapState() {

	return new MapState();

}
