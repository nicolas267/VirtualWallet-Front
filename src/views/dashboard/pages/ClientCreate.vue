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
        v-if="walletCreate"
        color="success"
        dark
        dismissible
      >
        Billetera creada correctamente
      </base-material-alert>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Complete los datos de usuario
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="name"
                    class="purple-input"
                    label="Nombre"
                    @keypress="isLetter($event)"
                  />
                </v-col>

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
                    v-model="phone"
                    label="Celular"
                    class="purple-input"
                    @input="numberFormat"
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
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="create"
                  >
                    Crear Billetera
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
        walletCreate: false,
        emailInvalid: false,
        error: false,
        message: null,
        name: null,
        email: null,
        phone: null,
        document: null,
      }
    },

    methods: {
      create () {
        if (this.name && this.email && this.phone && this.document) {
          const params = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            document: this.document,
          }

          axios.post('http://127.0.0.1:8000/clients/create', params)
            .then((e) => {
              if (e.data.code === 200) this.walletCreate = true
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

      isLetter (e) {
        const char = String.fromCharCode(e.keyCode)
        if (/^[A-Za-z ]+$/.test(char)) return true
        else e.preventDefault()
      },

      validateEmail (e) {
        const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (reg.test(e)) this.emailInvalid = false
        else this.emailInvalid = true
      },

      numberFormat (e) {
        const x = this.phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        this.phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
        if (this.phone.lenght > 9) e.preventDefault()
      },

      documentValidate (e) {
        const char = String.fromCharCode(e.keyCode)
        if (/^[A-Za-z0-9]+$/.test(char)) return true
        else e.preventDefault()
      },
    },
  }
</script>
