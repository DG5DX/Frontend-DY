import Login from "../views/login.vue";
import Singup from "../views/Singup.vue";

import Home from "../views/home.vue";
import Articulos from "../views/Articulos.vue";
import Categorias from "../views/Categorias.vue";
import Clientes from "../views/Clientes.vue";
import Movimientos from "../views/Movimientos.vue";
import Proveedores from "../views/Proveedores.vue";
import Usuarios from "../views/Usuarios.vue";

import MainLayout from "../layouts/MainLayout.vue";

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{ path: "/", redirect: "/login" },
	{ path: "/login", component: Login },
	{ path: "/singup", component: Singup },
	{
		path: "/",
		component: MainLayout,
		children: [
			{ path: "home", component: Home },
			{ path: "articulos", component: Articulos },
			{ path: "terceros/clientes", component: Clientes },
			{ path: "terceros/proveedores", component: Proveedores },
			{ path: "movimientos", component: Movimientos },
			{ path: "categorias", component: Categorias },
      { path: "usuarios", component: Usuarios },
		],
	},
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
