<template>
  <v-row>
    <v-col cols="12" class="pa-0">
      <v-card flat>
        <v-card-title class="headline">
          Bienvenido a CCARLA
        </v-card-title>
        <v-card-text class="body-2">
          Un proyecto diseñado para aprender de manera interactiva los conceptos
          de funciones en tres dimensiones para el curso de cálculo en varias
          variables.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-for="(item, i) in items" :key="i" cols="12" md="6" sm="12">
      <v-card :color="item.color" dark :to="item.link" hover>
        <v-row>
          <v-col cols="7">
            <v-card-title class="title" v-text="item.title"></v-card-title>

            <v-card-subtitle
              class="body-2 font-weight-light"
              v-text="item.subtitle"
            ></v-card-subtitle>
          </v-col>
          <v-col cols="5">
            <v-img :src="item.src" height="100" class="mr-3"></v-img>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        color: "#1F7087",
        src: `${process.env.BASE_URL}images/grafunc01.png`,
        title: "Para una función",
        subtitle: "Grafique una funcion del tipo z = f(x,y)",
        link: "/functiongrapher"
      },
      {
        color: "#952175",
        src:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTlx8UnxVfjW7TU5LNAiVoL3nLJLrOuQgc-wOE_cuCQYUQOjqIk&usqp=CAU",
        title: "Acerca de",
        subtitle: "Informacion del autor",
        link: "about"
      }
    ]
  })
};
</script>

<style></style>
