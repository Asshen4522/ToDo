<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: "", //скриптовое значение для связи с v-model
    inputname: "",
    ifError: false,
    typeIn: "",
});
const emit = defineEmits(["update:modelValue"]); // Обновление v-model

const inpVal = computed({
    get() { return props.modelValue },
    set(newValue) {
        emit("update:modelValue", newValue)
    }
})
</script>
<template>
    <div class="component">
        <input :class="{ errorStyle: ifError }" :type="typeIn" v-model="inpVal" required />
        <label :class="{ errorStyle: ifError }">{{ props.inputname }}</label>
    </div>
</template>

<style scoped>
.component {
    width: 100%;
    margin-top: 10px;
}



input {
    background: none;
    color: var(--color-accent);
    font-size: 18px;
    padding: 10px 0 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-accent);
}

label {
    color: var(--color-input);
    font-size: 16px;
    font-weight: normal;
    position: relative;
    pointer-events: none;
    left: 5px;
    top: -25px;
    transition: 1s ease all;
}


input:focus {
    outline: none;
    color: var(--color-accent);
}

input:focus~label,
:valid~label {
    top: -60px;
    font-size: 12px;
    color: var(--color-accent);
}

.errorStyle,
.errorStyle:focus,
.errorStyle:focus~label,
.errorStyle:valid~label {
    border-color: red;
    color: red;
}
</style>
