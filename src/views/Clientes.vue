<template>
	<div>
		<h4 class="text-center text-weight-bold">Clientes</h4>
		<hr />
		<div class="main-btn-registrar">
			<q-btn
				label="Registrar"
				@click="
					mostrarFormularioCliente = true;
					accionFormulario = true;
				"
				class="q-mb-md"
				id="btn-registrar" />
		</div>

		<q-table class="tabla-views" :rows="rows" :columns="columns" row-key="name">
			<template v-slot:top> </template>
			<template v-slot:header="props">
				<tr>
					<th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
						<span>{{ col.label }}</span>
					</th>
				</tr>
			</template>

			<template v-slot:body-cell-estado="props">
				<q-td :props="props" class="q-pa-sm">
					<span style="color: green" v-if="props.row.estado == 1">Activo</span>
					<span style="color: red" v-else>Inactivo</span>
				</q-td>
			</template>

			<template v-slot:body-cell-opciones="props">
				<q-td :props="props" class="tabla-cell opciones">
					<q-btn
						icon="edit"
						color="primary"
						flat
						@click="controlFormulario(false, props.row)"
						class="q-mr-sm" />
					<q-btn
						:icon="props.row.estado === 1 ? 'remove_circle' : 'check_circle'"
						color="negative"
						flat
						@click="editarEstado(props.row)" />
				</q-td>
			</template>
		</q-table>

		<!-- Dialog para editar el artículo -->
		<q-dialog v-model="mostrarFormularioCliente" persistent>
			<q-card>
				<div class="text-h6">{{ accionFormulario ? "Agregar" : "Editar" }} Cliente</div>
				<q-card-section>
					<q-input
						v-model="nombreCliente"
						label="Nombre"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El nombre es obligatorio',
						]" />

					<q-input
						v-model="numCedulaCliente"
						label="Numero de cedula"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El numero de cedula es obligatorio',
						]" />

					<q-input
						v-model="telefonoCliente"
						label="Telefono"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El telefono es obligatorio',
						]" />

					<q-input
						v-model="emailCliente"
						label="Correo"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El email es obligatorio',
							(val) => /.+@.+\..+/.test(val) || 'El email debe ser válido',
						]" />

				</q-card-section>

				<q-card-actions>
					<q-btn
						label="Cancelar"
						color="secondary"
						flat
						@click="mostrarFormularioCliente = false; reset()" />
					<q-btn
						:label="accionFormulario ? 'Guardar' : 'Editar'"
						color="primary"
						flat
						@click="accionFormulario ? agregar() : editar()"
						:disable="!formValido" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useQuasar } from "quasar"; // Importamos useQuasar para acceder a las notificaciones
// import { useAuthStore } from "../store/useAuth.js";
import { getData, postData, putData } from "../services/apiClient.js";

const $q = useQuasar(); // Accedemos a Quasar para usar sus notificaciones

// const mainStore = useStore();
const articulo = ref({});
// const card = ref(false);

const rows = ref([]);
const columns = ref([
	{
		name: "nombre",
		align: "center",
		label: "Nombre",
		field: "nombre",
		sortable: true,
	},
	{
		name: "numCedula",
		align: "center",
		label: "Numero de cedula",
		field: "numCedula",
		sortable: true,
	},
	{
		name: "telefono",
		align: "center",
		label: "Telefono",
		field: "telefono",
		sortable: true,
	},
	{
		name: "email",
		align: "center",
		label: "Correo",
		field: "email",
		sortable: true,
	},
	{
		name: "estado",
		align: "center",
		label: "Estado",
		field: "estado",
		sortable: true,
	},
	{ name: "opciones", align: "center", label: "Opciones" },
]);

const mostrarFormularioCliente = ref(false);
const accionFormulario = ref(true);

const nombreCliente = ref("");
const numCedulaCliente = ref(0);
const telefonoCliente = ref(0);
const emailCliente = ref("");

const clienteSeleccionado = ref(null);
// const authStore = useAuthStore();

const formValido = computed(() => {
	return (
		nombreCliente.value &&
		numCedulaCliente.value &&
		telefonoCliente.value &&
		emailCliente.value
	);
});

function reset() {
	nombreCliente.value = "";
	numCedulaCliente.value = "";
	telefonoCliente.value = "";
	emailCliente.value = "";
}

onMounted(async () => {
	await getClientes();
});

async function getClientes() {
	try {
		const res = await getData("clientes");
		rows.value = res.clientes;
	} catch (error) {
		console.log(error);
	}
}

async function editarEstado(data) {
	alert(`clientes/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`, {})
	try {
		const res = await putData(
			`clientes/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`, {}
		);
		getClientes();
	} catch (error) {
		console.log(error);
	}
}

async function agregar() {
	try {
		const data = {
			nombre: nombreCliente.value,
			numCedula: numCedulaCliente.value,
			telefono: telefonoCliente.value,
			email: emailCliente.value,
		};
		const res = await postData("clientes", data);
		mostrarFormularioCliente.value = false;
		reset()
		getClientes();
	} catch (error) {
		console.log(error);
	}
}

async function editar() {
	try {
		const data = {
			nombre: nombreCliente.value,
			numCedula: numCedulaCliente.value,
			telefono: telefonoCliente.value,
			email: emailCliente.value,
		};
		const res = await putData(`clientes/${clienteSeleccionado.value}`, data);
		mostrarFormularioCliente.value = false;
		reset()
		getClientes();
	} catch (error) {
		console.log(error);
	}
}

function controlFormulario(accion, datos) {
	nombreCliente.value = datos.nombre;
	numCedulaCliente.value = datos.numCedula;
	telefonoCliente.value = datos.telefono;
	emailCliente.value = datos.email;

	clienteSeleccionado.value = datos._id;
	accionFormulario.value = accion;
	mostrarFormularioCliente.value = true;
}

// const dataclientes = async () => {
// 	try {
// 		const response = await getData("/clientes/clientes");
// 		if (response.clientes) {
// 			rows.value = response.clientes;
// 			console.log("clientes recibidos", response.clientes);
// 		} else {
// 			console.log("Respuesta sin artículos", response);
// 		}
// 	} catch (error) {
// 		console.log("Error al obtener artículos", error.message);
// 		$q.notify({
// 			type: "negative",
// 			message: `Error: ${error.message}`,
// 		});
// 	}
// };

// const toggleStatus = async (row) => {
// 	try {
// 		const newStatus = row.status === 1 ? 0 : 1;
// 		const response = await putData(`/clientes/articulo/${row._id}`, {
// 			status: newStatus,
// 		});

// 		if (response.articulo) {
// 			row.status = newStatus;
// 			console.log("Estado del artículo actualizado", response.articulo);
// 			$q.notify({
// 				type: "positive",
// 				message: "Estado actualizado correctamente",
// 			});
// 		} else {
// 			throw new Error(response.message || "No se pudo cambiar el estado");
// 		}
// 	} catch (error) {
// 		console.log("Error al cambiar el estado", error.message);
// 		$q.notify({
// 			type: "negative",
// 			message: `Error: ${error.message}`,
// 		});
// 	}
// };

// const editarArticulo = async (id) => {
// 	try {
// 		console.log("Artículo a editar", articulo.value);

// 		const response = await putData(`/clientes/articulo/${id}`, {
// 			nombre: articulo.value.nombre,
// 			precio: articulo.value.precio,
// 			stock: articulo.value.stock,
// 			imagen: articulo.value.imagen,
// 			categoria: articulo.value.categoria,
// 			estado: articulo.value.estado,
// 		});

// 		if (response.articulo) {
// 			console.log("Artículo editado", response.articulo);
// 			$q.notify({
// 				type: "positive",
// 				message: "Artículo editado correctamente",
// 			});
// 		} else {
// 			console.log("Error al editar el artículo", response.message);
// 			$q.notify({
// 				type: "negative",
// 				message: `Error: ${response.message}`,
// 			});
// 		}
// 	} catch (error) {
// 		console.log("Error al editar el artículo", error.message);
// 		$q.notify({
// 			type: "negative",
// 			message: `Error: ${error.message}`,
// 		});
// 	}
// };

// onMounted(() => {
// 	dataclientes();
// });
</script>

<style scoped>
* {
	padding: 0;
}

.tabla-views {
	margin: 30px auto;
	max-width: 1100px;
	border-radius: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabla-header {
	font-weight: bold;
	text-transform: uppercase;
	background-color: rgb(2, 21, 38);
	color: white;
	padding: 12px;
	text-align: center;
}

.tabla-cell.opciones button {
	padding: 5px 10px;
	border: none;
	color: white;
	cursor: pointer;
	border-radius: 4px;
}

.main-btn-registrar {
	display: flex;
	justify-content: end;
	text-align: center;
	max-width: 1150px;
}

#btn-registrar {
	background-color: rgb(2, 21, 38);
	color: white;
	font-weight: 600;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	display: flex;
	margin: 20px 30px 5px;
	justify-content: center;
	align-items: center;
	align-content: center;
	gap: 10px;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	padding: 10px;
}

#btn-registrar:hover {
	background-color: rgb(1, 104, 46);
	color: white;
	transform: translateY(-5px);
}

.q-card {
	border-radius: 5px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	background-color: #fff;
	margin: 10px auto;
	padding-bottom: 20px;
}

.q-card-section {
	background-color: bisque;
	padding: 0;
}

.text-h6 {
	text-align: center;
	font-size: 30px;
	font-weight: bold;
	color: white;
	background-color: rgb(85, 89, 92);
	padding: 30px;
}

.q-input {
	display: flex;

	padding: 20px 33px 22px;
}

.q-card__actions {
	display: flex;
	padding-top: 20px;
	justify-content: center;
}
</style>
