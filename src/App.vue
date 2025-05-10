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
      <div>
        <div class="caption"> По порядку создания</div>
        <div class="buttons">
          <button @click="taskData.sortBy('IdUp')">&#129033;</button>
          <button @click="taskData.sortBy('IdDown')">&#129035;</button>
        </div>
      </div>
      <div>
        <div class="caption"> По времени</div>
        <div class="buttons">
          <button @click="taskData.sortBy('dateUp')">&#129033;</button>
          <button @click="taskData.sortBy('dateDown')">&#129035;</button>
        </div>
      </div>
      <div>
        <div class="caption"> По дедлайну</div>
        <div class="buttons dead">
          <button @click="taskData.sortBy('both')">Все</button>
          <button @click="taskData.sortBy('timeOut')">Просроченные</button>
          <button @click="taskData.sortBy('notTimeOut')">Непросроченные</button>
        </div>
      </div>


    </div>
  </div>
  <TableShow />
  <button @click="modalShow = true" style="margin-top: 15px;">Добавить задачу</button>
  <modalCreateOrEdit createOrEdit="create" v-if="modalShow" @close="modalShow = false" />
  <modalCreateOrEdit createOrEdit="edit" v-if="editTask.value !== null" />
</template>

<style scoped>
.caption {
  color: var(--color-accent);
  font-size: larger;
  font-weight: bold;

  border-radius: 8px;
  border: 3px solid var(--color-accent);
  background-color: var(--color-main);
  margin-bottom: 10px;
  margin-top: 25%;
}

.buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.dead {
  flex-direction: column;
}

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
    height: 700px;
  }

}

@keyframes disappear {
  from {
    height: 700px;

  }

  to {

    height: 0px;
  }

}
</style>
