<script setup>
import { computed, ref, watch } from 'vue';
import useTasks from './composables/useTasks'
import modalCreateOrEdit from './components/modalCreateOrEdit.vue';
import TableShow from './components/tableShow.vue';
const taskData = useTasks()
const editTask = computed(() => taskData.editTaskId)
const modalShow = ref(false)
const sort = ref(false)

function toggleSortView() {
  if (sort.value) {
    closing.value = true
  } else {
    sort.value = !sort.value
  }
}

const closing = ref(false) //для анимации исчезновения
watch(closing, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      sort.value = !sort.value
      closing.value = false
    }, 1000)
  }
})

</script>

<template>
  <div class="sortSpace">
    <button @click="toggleSortView">Скрыть/показать варианты сортировки и фильтрации</button>
    <div v-if="sort" class="sortOptions" :class="{ hideSort: closing }">
      <button @click="taskData.sortBy('dateUp')">По возрастанию времени</button>
      <button @click="taskData.sortBy('dateDown')">По убывании времени</button>
      <!-- <button></button>
      <button></button>
      <button></button>
      <button></button>
      <button></button>
      <button></button>
      <button></button>
      <button></button> -->
    </div>
  </div>
  <TableShow />
  <button @click="modalShow = true" style="margin-top: 15px;">Добавить задачу</button>
  <modalCreateOrEdit createOrEdit="create" v-if="modalShow" @close="modalShow = false" />
  <modalCreateOrEdit createOrEdit="edit" v-if="editTask.value !== null" />
</template>

<style scoped>
.sortSpace {
  position: fixed;
  left: 50px;
  width: 200px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sortOptions {
  animation-duration: 1s;
  animation-name: appearance;
  overflow-y: hidden;
}

.hideSort {
  animation-duration: 1.1s;
  animation-name: disappear;
  overflow-y: hidden;
}




@keyframes appearance {
  from {
    height: 0px;
  }

  to {
    height: 200px;
  }

}

@keyframes disappear {
  from {
    height: 200px;

  }

  to {

    height: 0px;
  }

}
</style>
