<script setup>
import { computed, ref } from 'vue';
import useTasks from '../composables/useTasks';
const taskData = useTasks()
const tasks = computed(() => taskData.sortedMass.value)
</script>
<template>
    <div class="main">
        <div class="table_line table_header">
            <div>Управляем</div>
            <div>Суть задачи</div>
            <div>Дата и время выполнения</div>
            <div>Статус</div>
        </div>
        <div class="table">
            <transition-group name="table">
                <div class="table_line task" v-for="task in tasks" :key="task.id">
                    <div class="editDelBtn">
                        <div class="icon" @click="taskData.deleteTask(task.id)">&#128465;</div>
                        <div class="icon" @click="taskData.pickForEdit(task.id)">&#9998;</div>
                    </div>
                    <div>
                        {{ task.name }}
                    </div>
                    <div>
                        {{ task.exeDate.replace('/', '\n') }}
                    </div>
                    <div class="taskButtons" @click="taskData.toggleTask(task.id)">
                        <div v-if="task.isCompleted" class="taskDone">&check;</div>
                        <div v-else class="taskNotDone">&cross;</div>
                    </div>
                </div>
            </transition-group>
        </div>

    </div>
</template>
<style scoped>
.main {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.table-move,
.table-enter-active,
.table-leave-active {
    transition: 0.5s;
}

.table-leave-to {
    opacity: 0;
    transform: translateX(-100vw);
}

.table-enter-from {
    transform: translateY(100vh);
}

.table-leave-active {
    position: absolute;
}


.task {
    border: 2px, solid, var(--color-accent);
    background-color: var(--color-main);
    color: var(--color-accent);
    border-radius: 20px;
    padding: 10px;
}

.taskDone {
    width: 20px;
    height: 20px;
    font-size: 15px;
    cursor: pointer;
    border: 2px, solid, var(--color-accent);
    background-color: var(--color-accent);
    color: var(--color-main);

    border-radius: 5px;
    box-shadow: 2px 2px 5px 0px var(--color-accent);
}

.taskNotDone {
    width: 20px;
    height: 20px;
    font-size: 15px;
    cursor: pointer;
    border: 2px, solid, var(--color-accent);
    background-color: var(--color-main);
    color: var(--color-accent);

    border-radius: 5px;
    box-shadow: -2px -2px 5px 0px var(--color-accent) inset;
}

.icon {

    font-size: 20px;
    cursor: pointer;
}

.editDelBtn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 25px;
}

.taskButtons {
    display: flex;
    align-items: center;
    justify-content: center;
}


.table {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.table::-webkit-scrollbar {
    width: 12px;
    /* ширина scrollbar */
}

.table::-webkit-scrollbar-track {
    background: var(--color-main);
    /* цвет дорожки */
}

.table::-webkit-scrollbar-thumb {
    background-color: var(--color-accent);
    /* цвет плашки */
    border-radius: 20px;
    /* закругления плашки */
}




.table_line {
    width: 90%;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr;
    justify-content: center;
    align-items: center;
    color: var(--color-accent);
    font-weight: bold;
    margin-bottom: 10px;
}

.table_header {
    border: 2px, solid, var(--color-accent);
    background-color: var(--color-main);
    padding: 10px;
    border-radius: 20px;
    border-bottom-style: none;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    box-shadow: 0px 20px 10px 0px var(--color-main);
    margin-bottom: 25px;
}
</style>