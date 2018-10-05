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
            if ((this.user && this.user !== "") && (this.pass && this.pass !== "")) {
                return true;
            } else {
                if (!this.user || this.user == "") {
                    this.errors.push('Nombre de usuario requerido.');
                }
                if (!this.pass || this.pass == "") {
                    this.errors.push('Constraseña requerida.');
                }
            }
            e.preventDefault();
        }
    }
})