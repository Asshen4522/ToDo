<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import useTasks from '../composables/useTasks'
import Input from '../elements/Input.vue'
const taskData = useTasks()
const pickedTask = taskData.reqTask(taskData.editTaskId.value)

const emit = defineEmits(['close'])
const props = defineProps({
    createOrEdit: String
})

const currentDate = ref(new Date)
currentDate.value.setHours(currentDate.value.getHours() + 1)
let dateForInput = currentDate.value.getFullYear() + '-' + String(currentDate.value.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.value.getDate()).padStart(2, '0')
let timeForInput = String(currentDate.value.getHours()).padStart(2, '0') + ':' + String(currentDate.value.getMinutes()).padStart(2, '0')


const timeInterval = ref() //Хранилище интервала

const localInp = reactive({ //Хранилище инпутов
    name: '',
    date: '',
    time: ''
})

if (props.createOrEdit === 'edit') {
    localInp.name = pickedTask?.name
    localInp.date = pickedTask?.exeDate.split('/')[0]
    localInp.time = pickedTask?.exeDate.split('/')[1]
}

const errors = reactive({ //Хранилище ошибок
    name: '',
    dateTime: ''
})


function createTask() { // основная функция создания
    const a = checkDateTime()
    const b = checkName()
    if (a && b) {
        if (props.createOrEdit === 'edit') {
            taskData.editTask(localInp.name, localInp.date + '/' + localInp.time)
            closing.value = true
        } else if (props.createOrEdit === 'create') {
            taskData.createTask(localInp.name, localInp.date + '/' + localInp.time)
        }
        localInp.name = ''
        localInp.date = ''
        localInp.time = ''
    }

}

function checkName() { //Подфункция проверки названия
    if (localInp.name.trim()) {
        errors.name = ''
        return true
    } else {
        errors.name = 'Задача не может быть пустой'
        return false
    }
}

function checkDateTime() { //Подфункция проверки даты и времени

    if (!(localInp.date && localInp.time)) {
        errors.dateTime = 'Нужно указать дату И время'
        return false
    }
    if (dateForInput > localInp.date) {
        errors.dateTime = 'Путешествуем во времени?'
        return false
    }
    if (dateForInput === localInp.date) {
        if (timeForInput < localInp.time) {
            errors.dateTime = ''
            return true
        } else {
            errors.dateTime = 'Нужно выбрать время попозже для начала задачи'
            return false
        }

    } else {
        errors.dateTime = ''
        return true
    }
}

const closing = ref(false) //для анимации исчезновения
watch(closing, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            emit('close')
            if (props.createOrEdit === 'edit') {
                taskData.pickForEdit(null)
            }
        }, 1000)
    }
})


onMounted(() => { // запуск корректного обновления даты
    timeInterval.value = setInterval(() => {
        currentDate.value.setMinutes(currentDate.value.getMinutes() + 1)
        dateForInput = currentDate.value.getFullYear() + '-' + String(currentDate.value.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.value.getDate()).padStart(2, '0')
        timeForInput = String(currentDate.value.getHours()).padStart(2, '0') + ':' + String(currentDate.value.getMinutes()).padStart(2, '0')
    }, 60000);

})
onUnmounted(() => { //сброс интервала при закрытии окна
    clearInterval(timeInterval.value)
})
</script>
<template>

    <div class="container">
        <div class="background"></div>
        <div class="mainPart" :class="{ close: closing }">
            <div class="icon-container"><img class="icon" src="../assets/cross.svg" alt="Выйти" @click="closing = true">
            </div>
            <div class="mainField">
                <div v-if="props.createOrEdit === 'create'">Создание задачи</div>
                <div v-if="props.createOrEdit === 'edit'">Изменение задачи</div>

                <Input typeIn="text" inputname="Название" v-model="localInp.name" :ifError="errors.name" />
                <div>{{ errors.name }}</div>
                <div>
                    <div>Дедлайн</div>
                    <div class="dateTime">
                        <Input typeIn="date" v-model="localInp.date" :ifError="errors.dateTime" />
                        <Input typeIn="time" v-model="localInp.time" :ifError="errors.dateTime" />
                        <!-- <input type="date" :min="dateForInput" v-model="localInp.date"> -->
                        <!-- <input type="time" v-model="localInp.time"> -->
                    </div>
                    <div>{{ errors.dateTime }}</div>
                </div>
                <button @click="createTask" v-if="props.createOrEdit === 'edit'">Изменить задачу</button>
                <button @click="createTask" v-if="props.createOrEdit === 'create'">Создать задачу</button>
            </div>

        </div>
    </div>
</template>
<style scoped>
.dateTime {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 20px;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

}

.background {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background-color: var(--color-main);
    opacity: 0.5;
    z-index: 1000;
}

.mainPart {
    width: 40%;
    height: 40%;
    padding: 5%;
    animation-duration: 1s;
    animation-name: appearance;

    border: 5px, solid, var(--color-accent);
    background-color: var(--color-main);
    z-index: 1001;
    border-radius: 10%;
    overflow: hidden;
}

.mainField {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: var(--color-accent);
}

.icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.icon-container {
    display: flex;
    justify-content: end;
}

.close {
    width: 0px;
    height: 0px;
    padding: 0;
    animation-duration: 1s;
    animation-name: disappear;
}

@keyframes appearance {
    from {

        width: 0px;
        height: 0px;
        padding: 0;
    }

    to {
        width: 40%;
        height: 40%;
        padding: 5%;
    }

}

@keyframes disappear {
    from {
        width: 40%;
        height: 40%;
        padding: 5%;

    }

    to {

        width: 0px;
        height: 0px;
        padding: 0;
    }

}
</style>