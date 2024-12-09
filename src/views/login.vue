<template>
  <q-layout>
    <!-- Header con el botón de Sign Up -->
    <q-header class="bg-primary text-white">
      <div class="row justify-between items-center q-pa-md">
        <div>INVENTARIO DY 📦</div>
        <q-btn flat label="Sign Up" color="white" @click="goToSignUp" />
      </div>
    </q-header>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="my-card" bordered>
          <div class="header-login">
            <p>📦 LOG IN DY 📦</p>
          </div>
          <br />
          <h6>Iniciar Sesión</h6>
          <hr />
          <br />
          <div class="login-form" :class="{ 'fade-in': showForm }">
            <q-card-section class="q-pa-none">
              <div class="q-gutter-md">
                <q-input outlined v-model="email" label="Email" type="email" dense autofocus :rules="[ 
                  val => val && val.length > 0 || 'El email es obligatorio', 
                  val => /.+@.+\..+/.test(val) || 'El email es inválido' 
                ]" />
                <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña" outlined dense
                  color="primary" class="q-mt-md bordered-input text-bold"
                  :rules="[val => !!val || 'Ingrese una contraseña']">
                  <template v-slot:append>
                    <q-icon :name="showPassword ? '😐' : '😑'" class="cursor-pointer"
                      @click="togglePasswordVisibility" />
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <br /><br />
            <q-card-actions id="buttom">
              <q-btn @click="login" label="Iniciar Sesión" color="primary" text-color="white" unelevated
                class="rounded-btn" :loading="loading" :disable="loading" />
            </q-card-actions>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { postData } from "../services/apiClient.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/useAuth.js";
import { useQuasar } from "quasar"; // Importar Quasar para las notificaciones

const email = ref("");
const password = ref("");
const passwordError = ref("");
const loading = ref(false); // Declaración de `loading`
const showPassword = ref(false); // Estado para mostrar/ocultar contraseña
const router = useRouter();
const showForm = ref(false);
const authStore = useAuthStore();
const $q = useQuasar(); // Instancia de Quasar para usar notificaciones

// Mostrar/ocultar contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Función para redirigir al registro
const goToSignUp = () => {
  router.push("/singup");
};

onMounted(() => {
  showForm.value = true;
});

const login = async () => {
  loading.value = true; // Activar estado de carga
  try {
    const payload = {
      email: email.value,
      contraseña: password.value, // Consistente con el segundo código
    };

    const response = await postData("/usuarios/login", payload); // Misma ruta que en el registro
    const token = response.token;

    if (token) {
      authStore.token = token;

      // Mostrar notificación de éxito
      $q.notify({
        type: "positive",
        message: "Inicio de sesión exitoso",
        position: "top",
        timeout: 3000,
      });

      // Redirige a la página principal después del inicio de sesión
      router.push("/home");
    } else {
      console.log("Respuesta sin token:", response);

      // Mostrar notificación de error si no hay token
      $q.notify({
        type: "negative",
        message: "Inicio de sesión fallido: Token no recibido",
        position: "top",
        timeout: 3000,
      });
    }
  } catch (error) {
    if (error.response && error.response.data.error === "Contraseña incorrecta") {
      passwordError.value = "La contraseña es incorrecta";

      // Mostrar notificación de error por contraseña incorrecta
      $q.notify({
        type: "negative",
        message: "Contraseña incorrecta",
        position: "top",
        timeout: 3000,
      });
    } else {
      console.log("Error al iniciar sesión:", error.response?.data?.error || error.message);
      passwordError.value = "";

      // Mostrar notificación de error genérico
      $q.notify({
        type: "negative",
        message: "Error al iniciar sesión. Intente nuevamente.",
        position: "top",
        timeout: 3000,
      });
    }
  } finally {
    loading.value = false; // Desactivar estado de carga
  }
};
</script>


<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.my-card {
  width: 400px;
  border: 1px solid;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding-bottom: 15px;
}

.header-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: rgb(0, 60, 100);
  font-size: 35px;
  color: white;
  border-radius: 12px 12px 0 0;
  font-weight: 500;
}

hr {
  width: 50%;
  border: 1px solid;
  border-radius: 50%;
}


.login-form {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.login-form.fade-in {
  opacity: 1;
}


.img-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 17px;

}

h6 {
  margin: 3px 50px;
  text-align: center;


}

.q-input {
  border-radius: 8px;
  padding: 20px 40px 0px;
}

.q-btn {
  border-radius: 8px;
  display: flex;
  margin: 6px 30px 5px;
  background-color: rgb(148, 148, 148);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.q-header{
  font-size: 30px;
  height: 80px !important;
  background-color: rgb(0, 60, 100) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

#buttom {
  display: flex;
  justify-content: center;
  color: rgb(0, 60, 100) !important;
}

.q-card-actions {
  padding: 10px 0;
  margin: 40px;
}
</style>