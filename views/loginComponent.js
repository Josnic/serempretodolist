//componente login
var app = new Vue({
    el: '#loginForm',
    data: {
        errors: [],
        user: null,
        pass: null
    },
    methods: {
        checkForm: function(e) {
            this.errors = [];
            if (this.user == "" && this.pass == "") {
                console.log("success");
            } else {
                if (!this.user) {
                    this.errors.push('Nombre se usuario requerido.');
                }
                if (!this.age) {
                    this.errors.push('Constraseña requerida.');
                }
            }
            e.preventDefault();
        }
    }
})