<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
      <base-material-alert
        v-if="error"
        color="error"
        dark
        dismissible
      >
      {{ message }}
      </base-material-alert>
      <base-material-alert
        v-if="Pay"
        color="success"
        dark
        dismissible
      >
        Para confirmar su pago por favor ingrese a la siguiente url http://127.0.0.1:8000/wallet/pay/{{ token }}
      </base-material-alert>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Pagos
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <base-material-alert
                    v-if="emailInvalid"
                    color="error"
                    dark
                  >
                    email invalido
                  </base-material-alert>

                  <v-text-field
                    v-model="email"
                    label="Email"
                    class="purple-input"
                    @change="validateEmail($event)"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="document"
                    label="Documento"
                    class="purple-input"
                    @keypress="documentValidate($event)"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="pay"
                    label="Monto a pagar"
                    class="purple-input"
                    @keypress="isNumber($event)"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="create"
                  >
                    Pagar con Billetera
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {
        Pay: false,
        token: null,
        emailInvalid: false,
        error: false,
        message: null,
        email: null,
        document: null,
        pay: null,
      }
    },

    methods: {
      create () {
        if (this.email && this.document && this.pay) {
          const params = {
            email: this.email,
            document: this.document,
            pay: this.pay,
          }

          axios.post('http://127.0.0.1:8000/wallet/pay', params)
            .then((e) => {
              if (e.data.code === 200) {
                this.Pay = true
                this.token = e.data.token
              }
            })
            .catch((e) => {
              this.error = true
              this.message = 'Error de comunicacion por favor intente mas tarde'
            })
        } else {
          this.error = true
          this.message = 'Debe llenar todos los campos'
        }
      },

      isNumber (e) {
        const char = String.fromCharCode(e.keyCode)
        if (/^[0-9]+$/.test(char)) return true
        else e.preventDefault()
      },

      validateEmail (e) {
        const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (reg.test(e)) this.emailInvalid = false
        else this.emailInvalid = true
      },

      documentValidate (e) {
        const char = String.fromCharCode(e.keyCode)
        if (/^[A-Za-z0-9]+$/.test(char)) return true
        else e.preventDefault()
      },
    },
  }
</script>
