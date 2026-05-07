<template>
  <q-page class="flex flex-center column" padding>
    <h1 class="text-h3 text-primary text-center">Добро пожаловать!</h1>
    <q-card class="my-card">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input v-model="data.login" type="text" label="Логин" placeholder="User123" />
        <q-input v-model="data.password" type="password" label="Пароль" placeholder="12345" />
        <div class="flex flex-center">
          <q-btn :disable="isPending" label="Зарегистрироваться" type="submit" color="primary" />
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
        <div class="flex flex-center">
          <p @click="router.push('/auth/login')" class="text-primary text-caption">
            Уже есть аккаунт?
          </p>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { register } from 'src/api/register';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const { isPending, mutate } = useMutation({
  mutationFn: register,
  onError: () => {
    $q.notify({
      type: 'negative',
      message: 'Ошибка регистрации',
      position: 'top',
    });
  },
  onSuccess: () => {
    $q.notify({
      type: 'positive',
      message: 'Регистрация успешна',
      position: 'top',
    });
  },
});

const router = useRouter();

const data = reactive({
  login: '',
  password: '',
});

function onReset() {
  data.login = '';
  data.password = '';
}

function onSubmit() {
  mutate(data);
}
</script>

<style>
.my-card {
  width: 400px;
  max-width: 90vw;
  padding: 40px;
}
</style>
