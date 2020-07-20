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
        v-if="Recharge"
        color="success"
        dark
        dismissible
      >
        Recarga realizada correctamente
      </base-material-alert>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Recarga Saldo
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
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
                  md="6"
                >
                  <v-text-field
                    v-model="balance"
                    label="Saldo a recargar"
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
                    Recargar Billetera
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
        Recharge: false,
        error: false,
        message: null,
        phone: null,
        document: null,
        balance: null,
      }
    },

    methods: {
      create () {
        if (this.phone && this.document && this.balance) {
          const params = {
            phone: this.phone,
            document: this.document,
            balance: this.balance,
          }

          axios.post('http://127.0.0.1:8000/wallet/recharge', params)
            .then((e) => {
              if (e.data.code === 200) this.Recharge = true
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
