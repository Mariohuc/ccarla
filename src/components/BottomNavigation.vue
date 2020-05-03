<template>
  <v-bottom-navigation fixed color="red accent-4" v-model="bottomNav">
    <v-menu
      v-model="menuFunc"
      :close-on-content-click="false"
      top
      offset-y
      :max-width="maxwidth"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">
          <span>Función</span>
          <v-icon>mdi-function</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          <v-form v-model="validfunction" v-on:submit.prevent="replaceGraph">
            <v-row>
              <v-col cols="12" class="py-0">
                <v-text-field
                  label="z = "
                  placeholder="f(x,y)"
                  dense
                  v-model="zfunction"
                  :rules="functionRules"
                  :hint="function_message"
                  persistent-hint
                  append-outer-icon="mdi-send"
                  @click:append-outer="replaceGraph"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-menu
      v-model="menuVars"
      :close-on-content-click="false"
      top
      offset-y
      :max-width="maxwidth"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">
          <span>Rangos</span>
          <v-icon>mdi-variable-box</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-container>
          <v-row justify="center">
            <v-col cols="3" class="px-0 pb-0">
              <v-select
                v-model="variable"
                :items="variables"
                label="Variable"
                dense
                height="26"
              ></v-select>
            </v-col>
            <v-col v-if="variable === 'X'" cols="4" class="px-0 pb-0">
              <v-text-field
                :value="xMin"
                type="number"
                label="X-Negativos"
                :rules="varRules.min"
                append-outer-icon="mdi-plus-box"
                prepend-icon="mdi-minus-box"
                class="inputVar"
                @click:prepend="inc_dec_XMin('-')"
                @click:append-outer="inc_dec_XMin('+')"
                readonly
                dense
              ></v-text-field>
            </v-col>
            <v-col v-if="variable === 'X'" cols="4" class="px-0 pb-0">
              <v-text-field
                :value="xMax"
                type="number"
                label="X-Positivos"
                :rules="varRules.max"
                append-outer-icon="mdi-plus-box"
                prepend-icon="mdi-minus-box"
                class="inputVar"
                @click:prepend="inc_dec_XMax('-')"
                @click:append-outer="inc_dec_XMax('+')"
                readonly
                dense
              ></v-text-field>
            </v-col>
            <v-col v-if="variable === 'Y'" cols="4" class="px-0 pb-0">
              <v-text-field
                :value="yMin"
                type="number"
                label="Y-Negativos"
                :rules="varRules.min"
                append-outer-icon="mdi-plus-box"
                prepend-icon="mdi-minus-box"
                class="inputVar"
                @click:prepend="inc_dec_YMin('-')"
                @click:append-outer="inc_dec_YMin('+')"
                readonly
                dense
              ></v-text-field>
            </v-col>
            <v-col v-if="variable === 'Y'" cols="4" class="px-0 pb-0">
              <v-text-field
                :value="yMax"
                type="number"
                label="Y-Positivos"
                :rules="varRules.max"
                append-outer-icon="mdi-plus-box"
                prepend-icon="mdi-minus-box"
                class="inputVar"
                @click:prepend="inc_dec_YMax('-')"
                @click:append-outer="inc_dec_YMax('+')"
                readonly
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-menu>

    <v-btn>
      <span>Parámetros</span>
      <v-icon>mdi-alphabet-latin</v-icon>
    </v-btn>

    <v-menu
      v-model="menuOpt"
      :close-on-content-click="false"
      top
      offset-y
      :max-width="200"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">
          <span>Opciones</span>
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-actions>
          <v-row>
            <v-col cols="12" class="pt-1 pb-0">
              <v-btn color="secondary" @click="resetMainCamera" small block>
                <v-icon size="18" class="mr-1">mdi-camera</v-icon>
                Reiniciar camara
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-bottom-navigation>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

export default {
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      bottomNav: 0,
      menuFunc: false,
      menuVars: false,
      menuOpt: false,
      zfunction: "",
      function_message: "",
      validfunction: true,
      functionRules: [
        f => !!f || "La función es requerida",
        f => this.validFunction(f) || "Función invalida"
      ],
      variable: "X",
      variables: ["X", "Y"],
      varRules: {
        min: [v => !!v || "Nulo", v => (v <= 0 && v >= -20) || "[-20 : 0]"],
        max: [v => !!v || "Nulo", v => (v <= 20 && v >= 0) || "[0 : 20]"]
      }
    };
  },
  computed: {
    ...mapState("singleFunction", [
      "zFuncText",
      "xMin",
      "xMax",
      "yMin",
      "yMax",
      "zMin",
      "zMax"
    ]),
    ...mapState("scene3D", ["scene", "camera", "renderer", "controls"]),
    maxwidth() {
      if (this.window.width >= 960) return 400;
      if (this.window.width >= 600) return 480;
      return this.window.width;
    }
  },
  mounted() {
    this.zfunction = this.zFuncText;
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapMutations("singleFunction", [
      "setZFuncText",
      "setXMin",
      "setXMax",
      "setYMin",
      "setYMax",
      "createDefaultWireMaterial"
    ]),
    ...mapActions("singleFunction", [
      "setFirstGraphtoScene",
      "createGraph",
      "updateGraph",
      "createPlane3D"
    ]),
    ...mapActions("scene3D", ["resetCameraforSF"]),
    inc_dec_XMin(sign) {
      switch (sign) {
        case "-":
          if (this.xMin <= -20) return;
          this.setXMin(this.xMin - 1);
          break;
        case "+":
          if (this.xMin >= 0) return;
          this.setXMin(this.xMin + 1);
          break;
      }
      this.updateGraph(this.scene);
    },
    inc_dec_XMax(sign) {
      switch (sign) {
        case "-":
          if (this.xMax <= 0) return;
          this.setXMax(this.xMax - 1);
          break;
        case "+":
          if (this.xMax >= 20) return;
          this.setXMax(this.xMax + 1);
          break;
      }
      this.updateGraph(this.scene);
    },
    inc_dec_YMin(sign) {
      switch (sign) {
        case "-":
          if (this.yMin <= -20) return;
          this.setYMin(this.yMin - 1);
          break;
        case "+":
          if (this.yMin >= 0) return;
          this.setYMin(this.yMin + 1);
          break;
      }
      this.updateGraph(this.scene);
    },
    inc_dec_YMax(sign) {
      switch (sign) {
        case "-":
          if (this.yMax <= 0) return;
          this.setYMax(this.yMax - 1);
          break;
        case "+":
          if (this.yMax >= 20) return;
          this.setYMax(this.yMax + 1);
          break;
      }
      this.updateGraph(this.scene);
    },
    replaceGraph() {
      this.setZFuncText(this.zfunction);
      this.createGraph(this.scene).then(() => {
        this.function_message = "Gráfico listo!";
        setTimeout(() => (this.function_message = ""), 3000);
      });
    },
    resetMainCamera() {
      this.resetCameraforSF({
        xMax: this.xMax,
        yMax: this.yMax,
        zMax: this.zMax
      });
    },
    validFunction(functiontext) {
      try {
        const parser = math.parser();
        parser.evaluate("f(x,y) = ".concat(functiontext)); // f(x, y)
        parser.set("a", 1);
        parser.set("b", 1);
        parser.set("c", 1);
        parser.set("d", 1);
        parser.set("e", 1);
        parser.evaluate("f(1,1)");
        return true;
      } catch (error) {
        return false;
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
};
</script>

<style>
.inputVar input[type="number"] {
  -moz-appearance: textfield;
  text-align: center;
}
.inputVar input::-webkit-outer-spin-button,
.inputVar input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
