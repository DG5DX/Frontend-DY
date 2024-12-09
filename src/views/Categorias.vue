<template>
	<div>
		<h4 class="text-center text-weight-bold">Categoría</h4>
		<hr />
		<div class="main-btn-registrar">
			<q-btn
				label="Registrar"
				@click="
					mostrarFormularioCategoria = true;
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
		<q-dialog v-model="mostrarFormularioCategoria" persistent>
			<q-card>
				<div class="text-h6">
					{{ accionFormulario ? "Agregar" : "Editar" }} Categoria
				</div>
				<q-card-section>
					<q-input
						v-model="nombreCategoria"
						label="Nombre"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El nombre es obligatorio',
						]" />
					<q-input
						filled
						v-model="descripcionCategoria"
						label="descripcion"
						:rules="[
							(val) =>
								(val && val.length > 0) || 'La descripcion es obligatoria',
						]"
						autofocus />
				</q-card-section>

				<q-card-actions>
					<q-btn
						label="Cancelar"
						color="secondary"
						flat
						@click="
							mostrarFormularioCategoria = false;
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
import { useQuasar } from "quasar"; // Importar Quasar para las notificaciones

const $q = useQuasar();

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
		name: "descripcion",
		align: "center",
		label: "Descripcion",
		field: "descripcion",
		sortable: true,
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
		field: "Opciones",
	},
]);

// Variables que controlan funciones en el formulario
const mostrarFormularioCategoria = ref(false);
const accionFormulario = ref(true);

// Variables que contienen la informacion del formulario
const nombreCategoria = ref("");
const descripcionCategoria = ref("");

const categoriaSeleccionado = ref("");

onMounted(async () => {
	await getCategoria();
});

const formValido = computed(() => {
	return nombreCategoria.value && descripcionCategoria.value;
});

function reset() {
	nombreCategoria.value = "";
	descripcionCategoria.value = "";
}

async function getCategoria() {
	try {
		const res = await getData("categorias");
		rows.value = res.categorias;
		$q.notify({
			type: "positive",
			message: "Categorías cargadas exitosamente.",
			timeout: 3000,
		});
	} catch (error) {
		console.log(error);
		$q.notify({
			type: "negative",
			message: "Error al cargar categorías.",
			timeout: 3000,
		});
	}
}

async function editarEstado(data) {
	try {
		await putData(
			`categorias/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`
		);
		getCategoria();
		$q.notify({
			type: "positive",
			message: `Categoría ${data.estado === 1 ? "inactivada" : "activada"} con éxito.`,
			timeout: 3000,
		});
	} catch (error) {
		console.log(error);
		$q.notify({
			type: "negative",
			message: "Error al cambiar el estado de la categoría.",
			timeout: 3000,
		});
	}
}

async function agregar() {
	try {
		const data = {
			nombre: nombreCategoria.value,
			descripcion: descripcionCategoria.value,
		};
		await postData("categorias", data);
		mostrarFormularioCategoria.value = false;
		reset();
		getCategoria();
		$q.notify({
			type: "positive",
			message: "Categoría agregada exitosamente.",
			timeout: 3000,
		});
	} catch (error) {
		console.log(error);
		$q.notify({
			type: "negative",
			message: "Error al agregar categoría.",
			timeout: 3000,
		});
	}
}

async function editar() {
	try {
		const data = {
			nombre: nombreCategoria.value,
			descripcion: descripcionCategoria.value,
		};
		await putData(`categorias/${categoriaSeleccionado.value}`, data);
		mostrarFormularioCategoria.value = false;
		reset();
		getCategoria();
		$q.notify({
			type: "positive",
			message: "Categoría editada exitosamente.",
			timeout: 3000,
		});
	} catch (error) {
		console.log(error);
		$q.notify({
			type: "negative",
			message: "Error al editar categoría.",
			timeout: 3000,
		});
	}
}

function controlFormulario(accion, datos) {
	descripcionCategoria.value = datos.descripcion;

	categoriaSeleccionado.value = datos._id;
	accionFormulario.value = accion;
	mostrarFormularioCategoria.value = true;
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
