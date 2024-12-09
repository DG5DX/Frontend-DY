<template>
	<div>
		<h4 class="text-center text-weight-bold">Articulos</h4>
		<hr />
		<div class="main-btn-registrar">
			<q-btn
				label="Registrar"
				@click="
					mostrarFormularioArticulo = true;
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
		<q-dialog v-model="mostrarFormularioArticulo" persistent>
			<q-card>
				<div class="text-h6">{{ accionFormulario ? "Agregar" : "Editar" }} Articulo</div>
				<q-card-section>
					<q-input
						v-model="nombreArticulo"
						label="Nombre"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El nombre es obligatorio',
						]" />

					<q-input
						v-model.number="precioArticulo"
						label="Precio"
						type="number"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) ||
								'El precio es obligatorio',
							(val) => val > 0 || 'El precio debe tener un valor',
						]" />

					<q-input
						v-model.number="stockArticulo"
						label="Stock"
						type="number"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) ||
								'El stock es obligatorio',
							(val) => val >= 0 || 'El stock no puede ser negativo',
						]" />

					<q-input
						v-model="imagenArticulo"
						label="URL de la Imagen"
						filled
						:rules="[
							(val) =>
								(val && val.length > 0) || 'La URL de la imagen es obligatoria',
							(val) =>
								val.startsWith('http') || 'La URL de la imagen debe ser válida',
						]" />

					<q-select
						v-model="categoriaArticulo"
						label="Categoría"
						:options="opcionesCategoria"
						filled
						:rules="[(val) => val || 'La categoria es obligatoria']" />
				</q-card-section>

				<q-card-actions>
					<q-btn
						label="Cancelar"
						color="secondary"
						flat
						@click="mostrarFormularioArticulo = false; reset()" />
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
import { useQuasar } from "quasar"; 
import { getData, postData, putData } from "../services/apiClient.js";

const $q = useQuasar();

const categorias = ref([]);
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
		name: "categoria",
		align: "center",
		label: "Categoria",
		field: (row) => { return row.categoria ? row.categoria.nombre : "" },
		sortable: true,
	},
	{
		name: "precio",
		align: "center",
		label: "Precio",
		field: "precio",
		sortable: true,
	},
	{
		name: "stock",
		align: "center",
		label: "Stock",
		field: "stock",
		sortable: true,
	},
	{
		name: "avatar",
		align: "center",
		label: "Imagen",
		field: "avatar",
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

const mostrarFormularioArticulo = ref(false);
const accionFormulario = ref(true);

const nombreArticulo = ref("");
const precioArticulo = ref(0);
const stockArticulo = ref(0);
const imagenArticulo = ref("");
const categoriaArticulo = ref("");

const articuloSeleccionado = ref(null);

const formValido = computed(() => {
	return (
		nombreArticulo.value &&
		precioArticulo.value &&
		stockArticulo.value &&
		imagenArticulo.value &&
		categoriaArticulo.value
	);
});

function reset() {
	nombreArticulo.value = "";
	precioArticulo.value = 0;
	stockArticulo.value = 0;
	imagenArticulo.value = "";
	categoriaArticulo.value = "";
}

onMounted(async () => {
	getCategorias();
	await getArticulos();
});

const opcionesCategoria = computed(() => {
	return categorias.value.map((c) => {
		return { label: c.nombre, id: c._id };
	});
});

async function getCategorias() {
	try {
		const res = await getData("categorias");
		categorias.value = res.categorias;
	} catch (error) {
		$q.notify({
			type: "negative",
			message: "Error al obtener las categorías.",
		});
		console.error(error);
	}
}

async function getArticulos() {
	try {
		const res = await getData("articulos");
		rows.value = res.articulos;
	} catch (error) {
		$q.notify({
			type: "negative",
			message: "Error al obtener los artículos.",
		});
		console.error(error);
	}
}

async function editarEstado(data) {
	try {
		await putData(
			`articulos/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`
		);
		getArticulos();
		$q.notify({
			type: "positive",
			message: `Artículo ${data.estado === 1 ? "inactivado" : "activado"} correctamente.`,
		});
	} catch (error) {
		$q.notify({
			type: "negative",
			message: "Error al cambiar el estado del artículo.",
		});
		console.error(error);
	}
}

async function agregar() {
	try {
		const data = {
			nombre: nombreArticulo.value,
			precio: precioArticulo.value,
			stock: stockArticulo.value,
			imagen: imagenArticulo.value,
			categoria: categoriaArticulo.value.id,
		};
		await postData("articulos", data);
		mostrarFormularioArticulo.value = false;
		reset();
		getArticulos();
		$q.notify({
			type: "positive",
			message: "Artículo agregado correctamente.",
		});
	} catch (error) {
		$q.notify({
			type: "negative",
			message: "Error al agregar el artículo.",
		});
		console.error(error);
	}
}

async function editar() {
	try {
		const data = {
			nombre: nombreArticulo.value,
			precio: precioArticulo.value,
			stock: stockArticulo.value,
			imagen: imagenArticulo.value,
			categoria: categoriaArticulo.value.id,
		};
		await putData(`articulos/${articuloSeleccionado.value}`, data);
		mostrarFormularioArticulo.value = false;
		reset();
		getArticulos();
		$q.notify({
			type: "positive",
			message: "Artículo editado correctamente.",
		});
	} catch (error) {
		$q.notify({
			type: "negative",
			message: "Error al editar el artículo.",
		});
		console.error(error);
	}
}

function controlFormulario(accion, datos) {
	nombreArticulo.value = datos.nombre;
	precioArticulo.value = datos.precio;
	stockArticulo.value = datos.stock;
	imagenArticulo.value = datos.imagen;
	categoriaArticulo.value = opcionesCategoria.value.find(c => c.id === datos.categoria);

	articuloSeleccionado.value = datos._id;
	accionFormulario.value = accion;
	mostrarFormularioArticulo.value = true;
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

.q-input, .q-select {
	display: flex;

	padding: 20px 33px 22px;
}

.q-card__actions {
	display: flex;
	padding-top: 20px;
	justify-content: center;
}
</style>