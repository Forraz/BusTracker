import { createRouter, createWebHistory } from "vue-router";
import Tracker from "./views/Tracker.vue";

const routes = [
	{ path: "/tracker", component: Tracker },
]

const router = createRouter({
	history: createWebHistory(),
	routes
});


export default router;
