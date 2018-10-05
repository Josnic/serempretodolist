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