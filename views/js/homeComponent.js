var socket;
socket = io.connect("http://localhost:3000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    // reconnectionAttempts: 3
});


var sessionUser = new Vue({
    el: '#titleUser',
    data: {
        userName: ""
    },
    methods: {
        closeSession: function closeSession() {
            window.location.href = "/logout";
        }
    }
})

function getNameSession() {
    socket.emit("name user", {}, function(data) {
        if (data == "" || data == "undefined" || data == null) {
            window.location.href = "/index";
        } else {
            sessionUser.userName = data;
        }
    })
}

socket.on("connect", function() {
    console.log("conectado");
    getNameSession();

})

socket.on('disconnect', function() {
    window.location.href = "/index";
});



Vue.component('modal', {
    template: '#modal-template'
})

// start app
var modalAlert = new Vue({
    el: '#modal-component',
    data: {
        showModal: false,
        customHeader: 'Cuidado!',
        contentModal: ''
    }
})


Vue.component('task-list', {
    template: '#task-list',
    props: {
        tasks: { default: [] }
    },

    data: function data() {
        return {
            newTask: ''
        };

    },
    computed: {
        incomplete: function incomplete() {
            return this.tasks.filter(this.inProgress).length;
        }
    },

    methods: {
        addTask: function addTask() {
            if (this.newTask) {
                var t = this;

                var listTasks = this.tasks;
                socket.emit("add", { name: this.newTask }, function(data) {
                    if (data.ok) {

                        t.tasks.splice(0, 0, {
                            id: data.id,
                            title: t.newTask,
                            completed: false
                        });

                        t.newTask = '';
                    } else {
                        console.log(data.error);
                        modalAlert.contentModal = "No se pudo guardar la tarea. Intenta de nuevo.";
                        modalAlert.showModal = true;
                    }
                })

            } else {
                modalAlert.contentModal = "Digita un texto válido";
                modalAlert.showModal = true;
            }
        },
        completeTask: function completeTask(task) {
            task.completed = !task.completed;
        },
        removeTask: function removeTask(index) {
            console.log(this.tasks[index].id);
            var listTask = this.tasks;
            var i = index;
            socket.emit("delete", { id: this.tasks[index].id }, function(data) {
                if (data.ok) {
                    listTask.splice(i, 1);
                } else {
                    modalAlert.contentModal = "Nose pudo eliminar la tarea. Intenta de nuevo.";
                    modalAlert.showModal = true;
                }
            })

        },
        clearCompleted: function clearCompleted() {
            this.tasks = this.tasks.filter(this.inProgress);
        },
        clearAll: function clearAll() {
            this.tasks = [];
        },

        inProgress: function inProgress(task) {
            return !this.isCompleted(task);
        },
        isCompleted: function isCompleted(task) {
            return task.completed;
        }
    }
});



Vue.component('task-item', {
    template: '#task-item',
    props: ['task'],
    computed: {
        className: function className() {
            var classes = ['tasks__item__toggle'];
            if (this.task.completed) {
                classes.push('tasks__item__toggle--completed');
            }
            return classes.join(' ');
        }
    }
});

socket.emit("readAll", {}, function(data) {
    if (data.ok) {
        var arrayTask = [];

        for (var i = 0; i < data.tasks.length; i++) {
            arrayTask.push({
                id: data.tasks[i].id,
                title: data.tasks[i].name,
                completed: data.tasks[i].complete
            })
        }

        new Vue({
            el: '#app',
            data: {
                tasks: arrayTask
            }
        });
    }
    console.log(data);
})