import { computed, ref, watch } from "vue";

const tasks = ref([])
try {
    const localTasks = localStorage.getItem('tasks')
    if (localTasks) {
        tasks.value= JSON.parse(localTasks)
    }
} catch (error) {}
watch(tasks,(newValue)=>{
    localStorage.setItem('tasks',JSON.stringify(newValue))
},
{deep:true})

const editTaskId = ref(null)

const newId = computed(()=> {
    if (!tasks.value.length) {
        return 0
    }else{
        return tasks.value.reduce((acc, curr) => {
            if (acc.id > curr.id) {
                return acc
            } else {
                return curr
            }
        }).id+1;
    }
})  

const reqTask = ((reqId)=> tasks.value.find((task)=>task.id===reqId))

function createTask(taskName,taskDate) {
    tasks.value.push({
        id:newId.value,
        name:taskName,
        exeDate:taskDate,
        isTimeOut:false,
        isCompleted:false,
    })
}

function toggleTask(taskId) {
    tasks.value[tasks.value.indexOf(reqTask(taskId))].isCompleted=!tasks.value[tasks.value.indexOf(reqTask(taskId))].isCompleted
}

function deleteTask(taskId) {
    tasks.value.splice(tasks.value.indexOf(reqTask(taskId)),1)
}

function pickForEdit(taskId) {
    editTaskId.value=taskId
}

function editTask(taskName,taskDate) {
    const reqInd= tasks.value.indexOf(reqTask(editTaskId.value))
    tasks.value[reqInd].name=taskName
    tasks.value[reqInd].exeDate=taskDate
}

function sortBy(sortParam) {  
    switch (sortParam) {
        case 'dateUp':
            tasks.value.sort(compareDateUp)
            break;
         case 'dateDown':
            tasks.value.sort(compareDateDown)
            break;
        case 'timeOut':
        case 'notTimeOut':
        case 'both':
            selector.value = sortParam           
            break;
        case 'IdUp':
            tasks.value.sort(compareIdUp)
            break;
        case 'IdDown':
            tasks.value.sort(compareIdDown)
            break;
    }
}

function compareDateUp(a, b) {
  if (a.exeDate.split('/')[0] < b.exeDate.split('/')[0]) {
    return -1;
  } else if (a.exeDate.split('/')[0] > b.exeDate.split('/')[0]) {
    return 1;
  }else if (a.exeDate.split('/')[1] < b.exeDate.split('/')[1]) {
    return -1;
  }else if (a.exeDate.split('/')[1] > b.exeDate.split('/')[1]) {
    return 1;
  }
  return 0;
}
function compareDateDown(a, b) {
  if (a.exeDate.split('/')[0] < b.exeDate.split('/')[0]) {
    return 1;
  } else if (a.exeDate.split('/')[0] > b.exeDate.split('/')[0]) {
    return -1;
  }else if (a.exeDate.split('/')[1] < b.exeDate.split('/')[1]) {
    return 1;
  }else if (a.exeDate.split('/')[1] > b.exeDate.split('/')[1]) {
    return -1;
  }
  return 0;
}
function compareIdUp(a, b) {
  if (a.id < b.id) {
    return -1;
  } else if (a.id > b.id) {
    return 1;
  }
  return 0;
}
function compareIdDown(a, b) {
  if (a.id < b.id) {
    return 1;
  } else if (a.id > b.id) {
    return -1;
  }
  return 0;
}


const selector=ref('both')
const sortedMass = computed(()=>{
    let Result = []
    switch (selector.value) {
        case 'both':
            Result = tasks.value
            break;
        case 'timeOut':
            Result = tasks.value.filter((task)=>task.isTimeOut===true)
            break;
        case 'notTimeOut':
            Result = tasks.value.filter((task)=>task.isTimeOut===false)
            break;
    }
    return Result
})












const timeInterval = ref(null)
const currentDate = ref(new Date)
const dateForInput = computed(()=>currentDate.value.getFullYear() + '-' + String(currentDate.value.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.value.getDate()).padStart(2, '0'))
const timeForInput = computed(()=>String(currentDate.value.getHours()).padStart(2, '0') + ':' + String(currentDate.value.getMinutes()).padStart(2, '0'))

function updateDates() {
    let notFinished = tasks.value.filter((task)=>task.isTimeOut === false)
    notFinished.forEach(task => {
        if (!task.isTimeOut) {
            if (task.exeDate.split('/')[0] < dateForInput.value) {
                tasks.value[tasks.value.indexOf(reqTask(task.id))].isTimeOut = true
            }else if(task.exeDate.split('/')[0] === dateForInput.value){
                if (task.exeDate.split('/')[1] < timeForInput.value) {
                    tasks.value[tasks.value.indexOf(reqTask(task.id))].isTimeOut = true
                }
            }
        }
    });
}


// tasks.value.forEach(task => {
//     task.isTimeOut=false
// });


updateDates()

timeInterval.value = setInterval(() => {
        currentDate.value = new Date
    }, 60000);
watch(currentDate,(newVal)=>updateDates(),
{deep:true})




export default function useTasks() {
    return { tasks,sortedMass,editTaskId,reqTask, createTask,toggleTask,deleteTask,pickForEdit,editTask,sortBy}
}