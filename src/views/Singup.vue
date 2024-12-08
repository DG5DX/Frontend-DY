<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <div class="row justify-between items-center q-pa-md">
        <div>INVENTARIO DY 📦</div>
        <q-btn flat label="Sign in" color="white" @click="goToLogIn" />
      </div>
    </q-header>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="my-card" bordered>
            <div class="header-login">
              <p> 📦 SIGN UP DY 📦</p>
            </div>
            <h6>Crear Cuenta</h6>
            <hr/>
            <div class="login-form" :class="{ 'fade-in': showForm }">
              <q-form @submit.prevent="handleSubmit" ref="formRef">
                <q-card-section>
                  <q-input v-model="form.name" label="Nombre" outlined dense color="primary"
                    class="q-mb-md bordered-input text-bold"
                    :rules="[val => !!val || 'Ingrese su nombre de usuario']" />
                  <q-input v-model="form.email" label="Email" type="email" outlined dense color="primary"
                    class="q-mt-md bordered-input text-bold"
                    :rules="[
                      val => !!val || 'Ingrese un email valido', 
                      val => /.+@.+\..+/.test(val) || 'Email no válido']" />
                  <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Contraseña"
                    outlined dense color="primary" class="q-mt-md bordered-input text-bold"
                    :rules="[val => !!val || 'Ingrese una contraseña']">
                    <template v-slot:append>
                      <q-icon :name="showPassword ? '😐' : '😑'" class="cursor-pointer"
                        @click="togglePasswordVisibility" />
                    </template>
                  </q-input>
                </q-card-section>

                <q-card-actions id="buttom">
                  <q-btn label="Crear Cuenta" type="submit" color="primary" text-color="white" unelevated
                    class="rounded-btn" :loading="loading" :disable="loading" />
                </q-card-actions>
              </q-form>

              <q-card-section v-if="error" class="text-negative text-center q-mt-md">
                {{ error }}
              </q-card-section>
            </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postData } from "../services/apiClient.js";
import { useQuasar } from "quasar";

const form = ref({
  name: "",
  email: "",
  password: "",
});
const error = ref("");
const loading = ref(false);
const formRef = ref(null);
const showPassword = ref(false); // Estado para mostrar/ocultar contraseña
const router = useRouter();
const $q = useQuasar();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const goToLogIn = () => {
  router.push("/");
};

const handleSubmit = async () => {
  error.value = "";

  if (!(await formRef.value.validate())) {
    return;
  }

  loading.value = true;

  try {
    const payload = {
      email: form.value.email,
      contraseña: form.value.password,
    };
    const response = await postData("/usuarios", payload);

    console.log("Usuario registrado:", response);

    $q.notify({
      type: "positive",
      message: `Welcome, ${form.value.name}! Su registro fue exitoso.`,
    });

    form.value.name = "";
    form.value.email = "";
    form.value.password = "";
    loading.value = false;

    // Redirige a Home después del registro
    router.push("/home");
  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    error.value =
      err.response?.data?.msg || "Ocurrio un error, intentelo nuevamente.";
    $q.notify({
      type: "negative",
      message: error.value,
    });
    loading.value = false;
  }
};
</script>

<style scoped>
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
  padding-top: 15px;
}

.my-card {
  width: 400px;
  border: 1px solid;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding-bottom: 15px;
}

hr{
  width: 70%;
}

h6 {
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px;
  padding-top: 2px;
  font-size: 30px;
}

.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.text-white {
  color: #ffffff !important;
}

.bordered-card {
  border: 1px solid #000000;
  border-radius: 13px;
}

.cursor-pointer {
  cursor: pointer;
}

.q-input {
  border-radius: 8px;
  padding: 20px 40px 0px;
}

.q-header{
  font-size: 28.5px;
  height: 80px !important;
  background-color: rgb(0, 60, 100) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
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

#buttom{
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(0, 60, 100) !important;
}

.q-card-actions {
  padding: 10px 0;
  margin: 40px;
}

</style>