const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");

const restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

const schema = buildSchema(`
 type Query{
      restaurant(id: Int): Restaurant
      restaurants: [Restaurant]
    },
    type Restaurant {
      id: Int
      name: String
      description: String
      dishes: [Dish]
    }, 
    type Dish {
      name: String
      price: Int
    },
    input restaurantInput {
      id: Int
      name: String
      description: String
    },
    type DeleteResponse {
      ok: Boolean!
      restaurants: [Restaurant]
    },
    type Mutation {
      setRestaurant(input: restaurantInput): Restaurant
      deleteRestaurant(id: Int!): DeleteResponse
      editRestaurant(id: Int!, name: String!): Restaurant
    }
`);

const root = {
  restaurant: ({ id }) => {
    for ( restaurant of restaurants ) {
      if (restaurant.id === id) {
        return restaurant;
      }
    }  
  },
  
  restaurants: () => restaurants,
  
  setRestaurant: ({ input }) => {
    restaurants.push({ id: input.id, name: input.name, description: input.description });
    return input;
  },
  
  deleteRestaurant: ({ id }) => {
    deletedRest = restaurants[id];
    console.log("Deleted Restaurant:", JSON.stringify(deletedRest));
    for (let i = 0; i < restaurants.length; i++) {
      if (restaurants[i].id === id) {
        restaurants.splice(i, 1);
        return {ok : true}
      } 
    }
    return { ok : false };
  },

  editRestaurant: ({ id, name }) => {
    for (let i = 0; i < restaurants.length; i++){
      if (restaurants[i].id === id) {
        restaurants[i].name = name;
        return restaurants[i];
      }
    }
  },

};

const app = express();

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(5500, () => console.log(`Running Graphql on Port: ${port}`));
