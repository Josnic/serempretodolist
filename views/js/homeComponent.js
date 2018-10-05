var sessionUser = new Vue({
    el: '#titleUser',
    data: {
        userName: null
    },
    computed: {

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
                this.tasks.push({
                    title: this.newTask,
                    completed: false
                });

                this.newTask = '';
            }
        },
        completeTask: function completeTask(task) {
            task.completed = !task.completed;
        },
        removeTask: function removeTask(index) {
            this.tasks.splice(index, 1);
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



new Vue({
    el: '#app',
    data: {
        tasks: [{
                title: 'Make todo list',
                completed: true
            },

            {
                title: 'Go skydiving',
                completed: false
            }
        ]
    }
});