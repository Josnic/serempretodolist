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
            newTask: '',
            showButton: false
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

            socket.emit("update", { id: task.id, complete: !task.completed }, function(data) {
                if (data.ok) {
                    task.completed = !task.completed;
                } else {
                    modalAlert.contentModal = "No fue posible actualizar elestado de la tarea. Intenta de nuevo.";
                    modalAlert.showModal = true;
                }
            });



        },
        removeTask: function removeTask(index) {

            var listTask = this.tasks;
            var i = index;
            socket.emit("delete", { id: this.tasks[index].id }, function(data) {
                if (data.ok) {
                    listTask.splice(i, 1);
                } else {
                    modalAlert.contentModal = "No se pudo eliminar la tarea. Intenta de nuevo.";
                    modalAlert.showModal = true;
                }
            })

        },
        clearCompleted: function clearCompleted() {
            var t = this;
            socket.emit("removeCompleted", {}, function(data) {
                if (data.ok) {

                    var listTask = t.tasks;
                    for (var i = 0; i < listTask.length; i++) {
                        if (listTask[i].completed == true) {
                            listTask.splice(i, 1);
                            i = 0;
                        }
                    }

                } else {
                    modalAlert.contentModal = "No se pudo eliminar las tareas completadas. Intenta de nuevo.";
                    modalAlert.showModal = true;
                }
            })
        },
        clearAll: function clearAll() {
            var t = this;
            socket.emit("removeAll", {}, function(data) {
                if (data.ok) {
                    t.tasks = [];
                } else {
                    modalAlert.contentModal = "No se pudo eliminar las tareas. Intenta de nuevo.";
                    modalAlert.showModal = true;
                }
            })

        },

        inProgress: function inProgress(task) {
            return !this.isCompleted(task);
        },
        isCompleted: function isCompleted(task) {
            return task.completed;
        }
    }
});


var appItem = null;
Vue.component('task-item', {
    template: '#task-item',
    props: ['task'],
    data: function data() {
        return {

            showButton: false
        };

    },
    computed: {
        className: function className() {
            appItem = this;
            var classes = ['tasks__item__toggle'];
            if (this.task.completed) {
                classes.push('tasks__item__toggle--completed');
            }
            return classes.join(' ');
        }
    }
});

var appList = null;
var socket;
socket = io.connect("http://localhost:3000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    // reconnectionAttempts: 3
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

        appList = new Vue({
            el: '#app',
            data: {
                tasks: arrayTask

            }
        });
        getNameSession();
    }
})

function getNameSession() {
    socket.emit("name user", {}, function(data) {
        if (data == "" || data == "undefined" || data == null) {
            window.location.href = "/index";
        } else {
            console.log(data)
            sessionUser.userName = data.user;
            appList.$children[0].showButton = data.check;
            appItem.showButton = data.check;


        }
    })
}

socket.on("connect", function() {
    console.log("connect");
})

socket.on('disconnect', function() {
    window.location.href = "/index";
});

socket.on("add", function(data) {
    appList.tasks.splice(0, 0, {
        id: data.id,
        title: data.name,
        completed: data.complete
    });
});

socket.on("delete", function(data) {
    var listTask = appList.tasks;
    for (var i = 0; i < listTask.length; i++) {
        if (listTask[i].id == data.id) {
            listTask.splice(i, 1);
            i = listTask.length;
        }
    }
})

socket.on("update", function(data) {
    var listTask = appList.tasks;
    for (var i = 0; i < listTask.length; i++) {
        if (listTask[i].id == data.id) {
            listTask[i].completed = data.complete;
            i = listTask.length;
        }
    }
});

socket.on("removeCompleted", function() {
    var listTask = appList.tasks;
    for (var i = 0; i < listTask.length; i++) {
        if (listTask[i].completed == true) {
            listTask.splice(i, 1);
            i = 0;
        }
    }
})

socket.on("removeAll", function() {
    appList.tasks = [];
})