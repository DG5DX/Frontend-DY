<template>
	<div>
		<h4 class="text-center text-weight-bold">Proveedores</h4>
		<hr />
		<div class="main-btn-registrar">
			<q-btn
				label="Registrar"
				@click="
					mostrarFormularioProveedores = true;
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
		<q-dialog v-model="mostrarFormularioProveedores" persistent>
			<q-card>
				<div class="text-h6">
					{{ accionFormulario ? "Agregar" : "Editar" }} Proveedores
				</div>
				<q-card-section>
					<q-input
						v-model="nombreProveedores"
						label="Nombre"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El nombre es obligatorio',
						]" />

					<q-input
						v-model.number="identificacionProveedores"
						label="Identificación"
						type="number"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) ||
								'La identificación es obligatoria',
							(val) =>
								val > 0 || 'La identificación debe ser un número mayor a 0',
						]" />

					<q-input
						v-model="direccionProveedores"
						label="Dirección"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'La dirección es obligatoria',
						]" />

					<q-input
						v-model="telefonoProveedores"
						label="Teléfono"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) ||
								'El teléfono es obligatorio',
							(val) =>
								val.toString().length >= 10 ||
								'El teléfono debe tener al menos 10 dígitos',
						]" />
				</q-card-section>

				<q-card-actions>
					<q-btn
						label="Cancelar"
						color="secondary"
						flat
						@click="
							mostrarFormularioProveedores = false;
							reset();
						" />
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
import { getData, postData, putData } from "../services/apiClient.js";

// const mainStore = useStore();
const rows = ref([]);
let columns = ref([
	{
		name: "nombre",
		align: "center",
		label: "Nombre",
		field: "nombre",
		sortable: true,
	},
	{
		name: "identificacion",
		align: "center",
		label: "Identificacion",
		field: "identificacion",
		sortable: true,
	},
	{
		name: "direccion",
		align: "center",
		label: "Direccion",
		field: "direccion",
	},
	{
		name: "telefono",
		align: "center",
		label: "Telefono",
		field: "telefono",
	},
	{
		name: "estado",
		align: "center",
		label: "Estado",
		field: "estado",
	},
	{
		name: "opciones",
		align: "center",
		label: "Opciones",
	},
]);

const mostrarFormularioProveedores = ref(false);
const accionFormulario = ref(true);

const nombreProveedores = ref("");
const identificacionProveedores = ref("");
const direccionProveedores = ref("");
const telefonoProveedores = ref(0);

const proveedorSeleccionado = ref("");

const formValido = computed(() => {
	return (
		nombreProveedores.value &&
		identificacionProveedores.value &&
		direccionProveedores.value &&
		telefonoProveedores.value
	);
});

function reset() {
	nombreProveedores.value = "";
	identificacionProveedores.value = "";
	direccionProveedores.value = "";
	telefonoProveedores.value = 0;
}

onMounted(() => {
	getProveedores();
});

async function getProveedores() {
	try {
		const res = await getData("proveedores");
		rows.value = res.terceros;
	} catch (error) {
		console.log(error);
	}
}

async function editarEstado(data) {
	try {
		const res = await putData(
			`proveedores/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`
		);
		getProveedores();
	} catch (error) {
		console.log(error);
	}
}

async function agregar() {
	try {
		const data = {
			nombre: nombreProveedores.value,
			identificacion: identificacionProveedores.value,
			direccion: direccionProveedores.value,
			telefono: telefonoProveedores.value,
		};
		const res = await postData("proveedores", data);
		mostrarFormularioProveedores.value = false;
		reset();
		getProveedores();
	} catch (error) {
		console.log(error);
	}
}

async function editar() {
	try {
		const data = {
			nombre: nombreProveedores.value,
			identificacion: identificacionProveedores.value,
			direccion: direccionProveedores.value,
			telefono: telefonoProveedores.value,
		};
		const res = await putData(
			`proveedores/${proveedorSeleccionado.value}`,
			data
		);
		mostrarFormularioProveedores.value = false;
		reset();
		getProveedores();
	} catch (error) {
		console.log(error);
	}
}

function controlFormulario(accion, datos) {
	nombreProveedores.value = datos.nombre;
	identificacionProveedores.value = datos.identificacion;
	direccionProveedores.value = datos.direccion;
	telefonoProveedores.value = datos.telefono;

	proveedorSeleccionado.value = datos._id;
	accionFormulario.value = accion;
	mostrarFormularioProveedores.value = true;
}
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
