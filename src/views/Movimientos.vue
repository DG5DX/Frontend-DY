<template>
	<div>
		<h4 class="text-center text-weight-bold">Movimientos</h4>
		<hr />
		<div class="main-btn-registrar">
			<q-btn
				label="Registrar"
				@click="
					mostrarFormularioMovimientos = true;
					reset();
				"
				class="q-mb-md"
				id="btn-registrar" />
		</div>

		<q-table
			class="tabla-views"
			:rows="rows1"
			:columns="columns1"
			row-key="name">
			<template v-slot:top> </template>
			<template v-slot:header="props">
				<tr>
					<th v-for="col in props.cols" :key="col.name" :class="'tabla-header'">
						<span>{{ col.label }}</span>
					</th>
				</tr>
			</template>

			<template v-slot:body-cell-Articulos="props">
				<q-td :props="props">
					<button @click="controlDetalles(props.row)">Ver</button>
				</q-td>
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
						:icon="props.row.estado === 1 ? 'remove_circle' : 'check_circle'"
						color="negative"
						flat
						@click="editarEstado(props.row)" />
				</q-td>
			</template>
		</q-table>

		<!-- Dialog para editar el artículo -->
		<q-dialog v-model="mostrarFormularioMovimientos" persistent>
			<q-card>
				<div class="text-h6">Agregar Nuevo Articulo</div>
				<q-card-section>
					<q-select
						v-model="tipoMovimientos"
						:options="tipoOptions"
						label="Tipo"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'El tipo es obligatorio',
						]" />

					<q-input
						v-model="numFacturaMovimientos"
						label="Número de Factura"
						filled
						:rules="[
							(val) =>
								(val && val.length > 0) ||
								'El número de factura es obligatorio',
						]" />

					<q-input
						v-model="fechaMovimientos"
						label="Fecha"
						type="date"
						filled
						:rules="[
							(val) => (val && val.length > 0) || 'La fecha es obligatoria',
						]" />

					<!-- <q-input
						v-model.number="valor"
						label="Valor"
						type="number"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) ||
								'El valor es obligatorio',
							(val) => val > 0 || 'El valor debe ser un número mayor a 0',
						]" />

					<q-input
						v-model.number="iva"
						label="IVA"
						type="number"
						filled
						:rules="[
							(val) =>
								(val !== null && val !== undefined) || 'El IVA es obligatorio',
							(val) => val >= 0 || 'El IVA no puede ser negativo',
						]" /> -->
					<q-select
						v-model="compradorMovimientos"
						:options="opcionesComprador"
						option-value="id"
						option-label="label"
						label="Comprador"
						filled
						:rules="[(val) => val || 'El comprador es obligatorio']" />
					<q-input
						v-model.number="totalMovimientos"
						label="Total"
						type="number"
						filled
						:disable="true" />
				</q-card-section>

				<q-card-actions>
					<q-btn
						label="Cancelar"
						color="secondary"
						flat
						@click="
							mostrarFormularioMovimientos = false;
							reset();
						" />
					<q-btn
						label="Guardar"
						color="primary"
						flat
						@click="agregar1()"
						:disable="!formValido" />
				</q-card-actions>
			</q-card>
		</q-dialog>

		<div v-if="mostrarDetalles" class="q-pa-lg absolute full-width">
			<div class="row full-width q-mb-md">
				<q-space />
				<q-btn flat @click="mostrarDetalles = false"> ❌ </q-btn>
			</div>
			<q-table :rows="rows2" :columns="columns2" row-key="id">
				<template v-slot:top>
					<section class="row full-width justify-evenly items-center q-pr-md">
						<h2 class="text-h4 q-pl-xl text-green-7">
							Detalles del movimiento
						</h2>
						<q-space />
						<q-btn size="md" @click="editar2()" label="Guardar Detalles" />
					</section>
					<section class="column full-width q-pr-md">
						<div class="row justify-evenly items-center q-mb-md">
							<q-select
								standout="bg-green text-while"
								:options="tipoOptions"
								label="Tipo"
								v-model="tipoMovimientos" />
							<q-input
								standout="bg-green text-while"
								type="text"
								label="Numero de Factura"
								v-model="numFacturaMovimientos" />
							<q-input
								standout="bg-green text-while"
								type="date"
								label="Fecha"
								v-model="fechaMovimientos" />
							<q-select
								style="width: 200px"
								standout="bg-green text-while"
								option-value="id"
								:options="opcionesComprador"
								label="Comprador"
								v-model="compradorMovimientos" />
							<q-input
								:disable="true"
								standout="bg-green text-while"
								type="text"
								label="Total"
								v-model="totalMovimientos" />
						</div>
						<div class="row items-center">
							<h1 class="text-h4 q-pl-xl text-green-7">Productos</h1>
							<q-space />
							<q-select
								standout="bg-green text-while"
								style="width: 200px; margin-right: 30px"
								:options="opcionesArticulo"
								v-model="sArticulo"
								label="Articulos" />
							<q-btn
								size="md"
								@click="controlProductos()"
								label="Agregar Articulo" />
						</div>
					</section>
				</template>
				<template v-slot:body-cell-cantidad="props">
					<q-td :props="props">
						{{ props.row.cantidad }}
						<q-popup-edit v-model="props.row.cantidad" auto-save v-slot="scope">
							<q-input
								type="number"
								min="0"
								v-model="scope.value"
								dense
								autofocus
								@keyup.enter="validateAndSet(scope)"
								@focusout="validateAndSet(scope, props.row)" />
						</q-popup-edit>
					</q-td>
				</template>
				<template v-slot:body-cell-iva="props">
					<q-td :props="props">
						{{ props.row.iva }}
						<q-popup-edit v-model="props.row.iva" auto-save v-slot="scope">
							<q-input
								type="number"
								min="0"
								v-model="scope.value"
								dense
								autofocus
								@keyup.enter="validateAndSet(scope)"
								@focusout="validateAndSet(scope, props.row)" />
						</q-popup-edit>
					</q-td>
				</template>
				<template v-slot:body-cell-opciones="props">
					<q-td :props="props" class="row justify-center" style="gap: 20px">
						<q-btn
							@click="
								rows2.splice(props.rowIndex, 1);
								actualizarDatos(props.row);
							">
							❌
						</q-btn>
					</q-td>
				</template>
			</q-table>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, computed, toRaw } from "vue";
import { getData, postData, putData } from "../services/apiClient.js";
// import { Try } from "@mui/icons-material";

const articulos = ref([]);
const compradores = ref([]);
const tipoOptions = [
	"entrada",
	"salida",
	"devolucion entrada",
	"devolucion salida",
];

const rows1 = ref([]);
let columns1 = ref([
	{
		name: "tipo",
		align: "center",
		label: "Tipo",
		field: "tipo",
		sortable: true,
	},
	{
		name: "numeroFactura",
		align: "center",
		label: "Numero de factura",
		field: "numeroFactura",
	},
	{
		name: "fecha",
		align: "center",
		label: "Fecha",
		field: (row) => {
			return row.fecha.split("T")[0];
		},
	},
	{
		name: "comprador",
		align: "center",
		label: "Comprador",
		field: (row) => row.comprador.nombre,
	},
	{
		name: "Articulos",
		align: "center",
		label: "Articulos",
		field: "articulos",
	},
	{
		name: "total",
		align: "center",
		label: "total",
		field: "total",
	},
	{
		name: "estado",
		align: "center",
		label: "Estado",
		field: "estado",
	},
	{ name: "opciones", align: "center", label: "Opciones" },
]);

const rows2 = ref([]);
const columns2 = ref([
	{
		name: "id",
		label: "Producto",
		field: (row) => row.id.nombre,
		align: "center",
	},
	{
		name: "cantidad",
		label: "Cantidad",
		field: "cantidad",
		align: "center",
	},
	{
		name: "precio",
		label: "Precio",
		field: "precio",
		align: "center",
	},
	{
		name: "valor",
		label: "Valor",
		field: "valor",
		align: "center",
	},
	{
		name: "iva",
		label: "Iva (%)",
		field: "iva",
		align: "center",
	},
	{
		name: "total",
		label: "Total",
		field: "total",
		align: "center",
	},
	{
		name: "opciones",
		label: "Opciones",
		field: "opciones",
		align: "center",
	},
]);

const mostrarDetalles = ref(false);
const mostrarFormularioMovimientos = ref(false);
const accionFormulario = ref(true);

// Variables del formulario
const tipoMovimientos = ref("");
const numFacturaMovimientos = ref("");
const fechaMovimientos = ref("");
const compradorMovimientos = ref("");
const totalMovimientos = ref(0);
/* Variables dentro de articulo */
// const clienteMovimientos = ref("");
const cantidadMovimientos = ref(0);
// const precioMovimientos = ref(0);
const valorMovimiento = ref(0);
const ivaMovimiento = ref(0);
const totalArticuloMovimiento = ref(0);
const sArticulo = ref("");

const movimientoSeleccionado = ref("");

const formValido = computed(() => {
	return (
		tipoMovimientos.value &&
		numFacturaMovimientos.value &&
		fechaMovimientos.value &&
		compradorMovimientos.value
	);
});

function reset() {
	tipoMovimientos.value = "";
	numFacturaMovimientos.value = "";
	fechaMovimientos.value = "";
	compradorMovimientos.value = "";
	totalMovimientos.value = 0;
}

const opcionesComprador = computed(() => {
	return compradores.value.map((c) => {
		return { label: c.nombre, id: c._id };
	});
});

const opcionesArticulo = computed(() => {
	return articulos.value.map((c) => {
		return { label: c.nombre, id: c._id };
	});
});

async function getClientes() {
	try {
		const res = await getData("clientes");
		compradores.value = res.clientes;
	} catch (error) {
		console.log(error);
	}
}
async function getArticulos() {
	try {
		const res = await getData("articulos");
		articulos.value = res.articulos;
	} catch (error) {
		console.log(error);
	}
}

async function getMovimientos() {
	try {
		const res = await getData("movimientos");
		rows1.value = res.movimientos;
	} catch (error) {
		console.log(error);
	}
}

async function editarEstado(data) {
	try {
		const res = await putData(
			`movimientos/${data.estado === 1 ? "inactivar" : "activar"}/${data._id}`
		);
		getMovimientos();
	} catch (error) {
		console.log(error);
	}
}

async function agregar1() {
	try {
		const data = {
			tipo: tipoMovimientos.value,
			numeroFactura: numFacturaMovimientos.value,
			fecha: fechaMovimientos.value,
			comprador: compradorMovimientos.value.id,
			total: totalMovimientos.value,
		};
		const res = await postData("movimientos", data);
		mostrarFormularioMovimientos.value = false;
		reset();
		getMovimientos();
	} catch (error) {
		console.log(error);
	}
}

async function editar2() {
	try {
		const data = {
			tipo: tipoMovimientos.value,
			numeroFactura: numFacturaMovimientos.value,
			fecha: fechaMovimientos.value,
			articulos: rows2.value,
			comprador: compradorMovimientos.value.id,
			total: totalMovimientos.value,
		};
		const res = await putData(
			`movimientos/${movimientoSeleccionado.value}`,
			data
		);
		getMovimientos();
	} catch (error) {
		console.log(error);
	}
}

// Funcion que controla los datos mostrados al darle en el boton de ver
function controlDetalles(datos) {
	tipoMovimientos.value = datos.tipo;
	numFacturaMovimientos.value = datos.numeroFactura;
	fechaMovimientos.value = datos.fecha.split("T")[0];
	compradorMovimientos.value = opcionesComprador.value.find(
		(c) => c.id === datos.comprador._id
	);
	totalMovimientos.value = datos.total;
	rows2.value = datos.articulos;

	movimientoSeleccionado.value = datos._id;
	mostrarDetalles.value = true;
}

function controlProductos() {
	// valida si hay algo en el select de articulos
	if (!sArticulo.value) {
		return;
	}

	const repetido = rows2.value.find((a) => a.id === sArticulo.value.id);

	// valida si el producto ya habia sigo agregado en el movimiento
	if (!repetido) {
		const producto = articulos.value.find((p) => p._id === sArticulo.value.id);
		rows2.value.push({
			id: producto.id = {_id: producto._id, nombre: producto.nombre},
			cantidad: (cantidadMovimientos.value = 1),
			precio: producto.precio,
			valor: valorMovimiento.value,
			iva: (ivaMovimiento.value = 0),
			total: totalArticuloMovimiento.value,
		});
		actualizarDatos(rows2.value[rows2.value.length - 1]);
	}
}

// no me acuerdo para que servia, pero seguro que si se borra se daña el codigo
function validateAndSet(scope, row = null) {
	// Asegura que el valor no sea negativo
	if (scope.value < 0) {
		scope.value = 0;
	}
	scope.set(); // Guarda el valor

	// Si se pasa la fila, actualiza los datos
	if (row) {
		actualizarDatos(row);
	}
}

// funcion para actualizar los datos en la tabla de los articulos
function actualizarDatos(fila) {
	console.log(fila);

	const subtotal = fila.precio * fila.cantidad;
	const total = subtotal + subtotal * (fila.iva / 100);

	fila.valor = subtotal;
	fila.total = total;

	totalGeneral();
}

function totalGeneral() {
	totalMovimientos.value = rows2.value.reduce((acc, v) => {
		return acc + v.total;
	}, 0);
}

onMounted(() => {
	getClientes();
	getArticulos();
	getMovimientos();
});
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

.q-input,
.q-select {
	display: flex;

	padding: 20px 33px 22px;
}

.q-card__actions {
	display: flex;
	padding-top: 20px;
	justify-content: center;
}
</style>
