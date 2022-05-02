const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
let searchFood = "";

app.use(cors({origin: true}));

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shape-shifter-fitness-e89b7.firebaseio.com",
});

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

app.get("/", (req, res) => {
  return res.status(200).send("Shape Shifter - Get Your Personalized Diet Plan");
});

// search specific food
// get
app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("diet_data").doc(req.params.id);
      const diet_data = await reqDoc.get();
      const response = diet_data.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});


// search all foods
// get
app.get("/api/getSearchedFood", (req, res) => {
  (async () => {
    try {
      getSearchFood("aaaaa");
      const foodItem = searchFood;
      const query = db.collection("diet_data").where("Food", "==", foodItem);
      const response = [];

      await query.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            Sugar: doc.data().Sugar,
            DietaryFiber: doc.data().DietaryFiber,
          };

          response.push(selectedItem);
        });
        return response;
      });


      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

app.get("/api/getFruits", (req, res) => {
  (async () => {
    try {
      const foodCategory = "fruit";
      const query = db.collection("diet_data").where("FoodCategory", "==", foodCategory);
      const response = [];

      await query.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
          };
          response.push(selectedItem);
        });
        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];
  return item;
}

function generateBreakfast(req, bfProtein, bfFruit, bfGrains, bfSnack) {
  const item = [];
  const {daily_calorie_intake} = req.query;
   // const caloriDetails = calculatedCalorie(req);
  // const caloriDetails = {
    // daily_calorie_intake: 1800,
  // };


  let totalCalories = 0;
  const totalBfClariesNeeded = parseFloat(daily_calorie_intake)*0.3;

  item.push(getRandomItem(bfProtein));
  totalCalories = parseFloat(item[0].Calories);

  if (totalCalories < totalBfClariesNeeded) {
    item.push(getRandomItem(bfFruit));
    totalCalories += parseFloat(item[1].Calories);
  }

  if (totalCalories < totalBfClariesNeeded) {
    item.push(getRandomItem(bfGrains));
    totalCalories += parseFloat(item[2].Calories);
  }
  // 0.05 for morning snacks
  item.push(getRandomItem(bfSnack));

  return item;
}

function generateLunch(req, luProtein, luFruit, luGrains, luTasteEnchancer, luSnack, luVegitable) {
  const item = [];
  const {daily_calorie_intake} = req.query;
  // const caloriDetails = calculatedCalorie(req);
  // const caloriDetails = {
    // daily_calorie_intake: 1800,
// };


  let totalCalories = 0;
  const totalLuClariesNeeded = parseFloat(daily_calorie_intake)*0.4;

  item.push(getRandomItem(luProtein));
  totalCalories = parseFloat(item[0].Calories);

  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luVegitable));
    totalCalories += parseFloat(item[1].Calories);
  }
  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luVegitable));
    totalCalories += parseFloat(item[2].Calories);
  }
  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luVegitable));
    totalCalories += parseFloat(item[3].Calories);
  }

  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luFruit));
    totalCalories += parseFloat(item[4].Calories);
  }

  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luGrains));
    totalCalories += parseFloat(item[5].Calories);
  }
  if (totalCalories < totalLuClariesNeeded) {
    item.push(getRandomItem(luTasteEnchancer));
    totalCalories += parseFloat(item[6].Calories);
  }
  console.log(totalCalories);
  // 0.05 for evening snacks
  item.push(getRandomItem(luSnack));

  return item;
}

function generateDinner(req, diProtein, diSnack) {
  const item = [];

  const {daily_calorie_intake} = req.query;

  // const caloriDetails = calculatedCalorie(req);
  // const caloriDetails = {
    // daily_calorie_intake: 1800,
// };

  let totalCalories = 0;
  const totalDiClariesNeeded = parseFloat(daily_calorie_intake)*0.2;

  item.push(getRandomItem(diProtein));
  totalCalories = parseFloat(item[0].Calories);


  if (totalCalories < totalDiClariesNeeded) {
    item.push(getRandomItem(diSnack));
    totalCalories += parseFloat(item[1].Calories);
  }

  // 0.05 for morning snacks
  // item.push(getRandomItem(bfSnack));

  return item;
}

app.get("/api/bfcalculation", (req, res) => {
  (async () => {
    try {
      const foodCategoryFruit = "fruit";
      const foodCategoryPro = "protein";
      const foodCategoryGrain = "grains";
      const foodCategorySnack = "protein_snack";

      const queryProtine = db.collection("diet_data").where("FoodCategory", "==", foodCategoryPro);
      const queryFruit = db.collection("diet_data").where("FoodCategory", "==", foodCategoryFruit);
      const queryGrain = db.collection("diet_data").where("FoodCategory", "==", foodCategoryGrain);
      const querySnack = db.collection("diet_data").where("FoodCategory", "==", foodCategorySnack);

      const bfProtein = [];
      const bfFruit = [];
      const breakfast = [];
      const bfGrains = [];
      const bfSnack = [];

      await queryProtine.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
            bfProtein.push(selectedItem);
        });
        console.log(bfProtein);
        return bfProtein;
      });

      await queryFruit.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          // if (parseFloat((selectedItem.Protein).match(/(\d+)/)[1]) >10) {

            // console.log(parseFloat((selectedItem.Protein).match(/(\d+)/)[1]))
            bfFruit.push(selectedItem);
          // }
        });

        // /bfFruit.push(response);
        console.log(bfFruit);

        return bfFruit;
      });

      await queryGrain.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <160) {
            bfGrains.push(selectedItem);
          }
        });
        console.log(bfGrains);
        return bfGrains;
      });

      await querySnack.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <145) {
            bfSnack.push(selectedItem);
          }
        });
        console.log(bfSnack);
        return bfSnack;
      });


      breakfast.push(generateBreakfast(req, bfProtein, bfFruit, bfGrains, bfSnack));
      return res.status(200).send(breakfast);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});


app.get("/api/lucalculation", (req, res) => {
  (async () => {
    try {
      const foodCategoryFruit = "fruit";
      const foodCategoryPro = "protein";
      const foodCategoryGrain = "grains";
      const foodCategorySnack = "protein_snack";
      const foodCategoryTasteEnhancer = "taste_enhancer";
      const foodCategoryVegitable = "taste_enhancer";

      const queryProtine = db.collection("diet_data").where("FoodCategory", "==", foodCategoryPro);
      const queryFruit = db.collection("diet_data").where("FoodCategory", "==", foodCategoryFruit);
      const queryGrain = db.collection("diet_data").where("FoodCategory", "==", foodCategoryGrain);
      const querySnack = db.collection("diet_data").where("FoodCategory", "==", foodCategorySnack);
      const queryTasteEnhancer = db.collection("diet_data").where("FoodCategory", "==", foodCategoryTasteEnhancer);
      const queryVegitable = db.collection("diet_data").where("FoodCategory", "==", foodCategoryVegitable);


      const luProtein = [];
      const luFruit = [];
      const lunch = [];
      const luGrains = [];
      const luSnack = [];
      const luTasteEnchancer = [];
      const luVegitable = [];

      await queryProtine.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            luProtein.push(selectedItem);
          }
        });

        console.log(luProtein);
        return luProtein;
      });

      await queryFruit.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          // if (parseFloat((selectedItem.Protein).match(/(\d+)/)[1]) >10) {
            // console.log(req.query);
            // console.log(parseFloat((selectedItem.Protein).match(/(\d+)/)[1]))
            luFruit.push(selectedItem);
          // }
        });

        console.log(luFruit);

        return luFruit;
      });

      await queryGrain.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            luGrains.push(selectedItem);
          }
        });

        console.log(luGrains);
        return luGrains;
      });


      await queryTasteEnhancer.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            luTasteEnchancer.push(selectedItem);
          }
        });

        console.log(luTasteEnchancer);
        return luTasteEnchancer;
      });

      await querySnack.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            luSnack.push(selectedItem);
          }
        });

        console.log(luSnack);
        return luSnack;
      });

      await queryVegitable.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            luVegitable.push(selectedItem);
          }
        });

        console.log(luVegitable);
        return luVegitable;
      });


      lunch.push(generateLunch(req, luProtein, luFruit, luGrains, luTasteEnchancer, luSnack, luVegitable));
      return res.status(200).send(lunch);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

app.get("/api/dicalculation", (req, res) => {
  (async () => {
    try {
      const foodCategoryPro = "protein";
      const foodCategorySnack = "protein_snack";

      const queryProtine = db.collection("diet_data").where("FoodCategory", "==", foodCategoryPro);
      // const queryFruit = db.collection("diet_data").where("FoodCategory", "==", foodCategoryFruit);
      const querySnack = db.collection("diet_data").where("FoodCategory", "==", foodCategorySnack);
      // const query1 = db.collection("diet_data").where("FoodCategory", "==", protein);
      // const query2 = db.collection("diet_data").where("FoodCategory", "==", grains);
      // const query3 = db.collection("diet_data").where("FoodCategory", "==", protein);
      // const response = [];
      const diProtein = [];
      const diSnack = [];
      const dinner = [];

      await queryProtine.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            diProtein.push(selectedItem);
          }
        });
        console.log(diProtein);
        return diProtein;
      });

      await querySnack.get().then((data) => {
        const docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Food: doc.data().Food,
            AmountPer: doc.data().AmountPer,
            Calories: doc.data().Calories,
            TotalCarbohydrate: doc.data().TotalCarbohydrate,
            Protein: doc.data().Protein,
            TotalFat: doc.data().TotalFat,
            PhotoURL: doc.data().PhotoURL,
            User: "user_id",
          };
          if (parseFloat(selectedItem.Calories) <100) {
            diSnack.push(selectedItem);
          }
        });
        console.log(diSnack);
        return diSnack;
      });


      dinner.push(generateDinner(req, diProtein, diSnack));
      return res.status(200).send(dinner);
    } catch (error) {
      console.log(error);
      res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

function getSearchFood(searchTest) {
  console.log(searchTest);
  // searchFood = searchTest;
  searchFood = "Apple";
  return searchTest;
}

exports.test1 = functions.https.onRequest(app);
