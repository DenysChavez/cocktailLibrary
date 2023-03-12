const drinkBox = document.getElementById('drink-result');
const drinkList = document.getElementById('drink');
const searchBtn = document.getElementById('search-btn');
const drinkDetailsContent = document.querySelector('.drink-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Events Listeners
searchBtn.addEventListener('click', getDrinkList);
drinkList.addEventListener('click', getDrinkRecipe);
recipeCloseBtn.addEventListener('click', () => {
    drinkDetailsContent.parentElement.classList.remove('showRecipe');
});


// Display Recipes base of the information received
function getDrinkList(e) {
    e.preventDefault()
    // form inputs
    const form = document.querySelector('form');
    const searchByInput = form.querySelectorAll('input[name="seachBy"]');
    const searchInputText = document.getElementById('search-term').value.trim();

    
    searchByInput.forEach(input => {
        // Look up by Ingrediente Name
        if (input.value === "ingredient-name" && input.checked) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
                .then(response => response.json())
                .then(data => {
                    let html = "";
                    data.drinks.forEach(drink => {
                        html += `
                        <div class="drink-item" data-id="${drink.idDrink}">
                            <div class="drink-img">
                                <img src="${drink.strDrinkThumb}" alt="margarita">
                            </div>
                            <div class="drink-name">
                                <h3>${drink.strDrink}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>`
                    });
                    drinkList.innerHTML = html;
                })
            // Look up By Cocktail Name
        } else if (input.value === "cocktail-name" && input.checked) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputText}`)
                .then(response => response.json())
                .then(data => {
                    let html = "";
                    data.drinks.forEach(drink => {
                        html += `
                        <div class="drink-item" data-id="${drink.idDrink}">
                            <div class="drink-img">
                                <img src="${drink.strDrinkThumb}" alt="margarita">
                            </div>
                            <div class="drink-name">
                                <h3>${drink.strDrink}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>`
                    });
                    drinkList.innerHTML = html;
                })
        } else if (input.value === "first-letter" && input.checked) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchInputText}`)
                .then(response => response.json())
                .then(data => {
                    let html = "";
                    data.drinks.forEach(drink => {
                        html += `
                        <div class="drink-item" data-id="${drink.idDrink}">
                            <div class="drink-img">
                                <img src="${drink.strDrinkThumb}" alt="margarita">
                            </div>
                            <div class="drink-name">
                                <h3>${drink.strDrink}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>`
                    });
                    drinkList.innerHTML = html;
                })
        } else {
            drinkList.innerHTML = "Sorry We couldn't find a drink";
        }
    })
}


displayRandomDrinks()
// start page with random recipes
function displayRandomDrinks() {
    let html = ""

    for (let i = 0; i < 24; i++) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                // console.log(data.drinks[0].idDrink);
                html += `
                <div class="drink-item" data-id="${data.drinks[0].idDrink}">
                    <div class="drink-img">
                        <img src="${data.drinks[0].strDrinkThumb}">
                    </div>
                    <div class="drink-name">
                        <h3>${data.drinks[0].strDrink}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
                `;
                drinkList.innerHTML = html;
            });
    }
}

// get recipe of the drink
function getDrinkRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let drinkItem = e.target.parentElement.parentElement;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkItem.dataset.id}`)
            .then(response => response.json())
            .then(data => drinkRecipeModal(data.drinks));
    }
}

// Create html of the Get Recipe's Display(Modal)
function drinkRecipeModal(drink) {
    drink = drink[0];

    // save ingredients in an object
    let ingredients = Object.fromEntries(Object.entries(drink)
        .filter(([key, value]) => key.includes("strIngredient")));
    let measures = Object.fromEntries(Object.entries(drink)
        .filter(([key, value]) => key.includes("strMeasure")));
    
    // cocktail variable holds our merged data witouth null keys and change value of keys where their values are null 
    let cocktail = {};
    for (let key in ingredients) {
        if (ingredients.hasOwnProperty(key) && ingredients[key] !== null) {
            let ingredient = ingredients[key];
            let measure = measures["strMeasure" + key.slice(13)];
            if (measure === null) {
                measure = "of your preference"
            }
            cocktail[ingredient] = measure
        }
    }

    // create List of Ingredientes for the Recipe HTML
    let ingredientsHtml = "";
    for (let key in cocktail) {
        ingredientsHtml += `<li>${key}: ${cocktail[key]}</li>`
    }

    //save Recipe's Instructions
    let instructions = drink.strInstructions.trim().split(".");
    instructions = instructions.filter(word => word !== "")
    let instructionsHtml = ""
    for (let i = 0; i < instructions.length; i++) {
        instructionsHtml += `${instructions[i]}<br>`
    }

      //add everything in the html
      let html = `
      <h2 class="recipe-title">${drink.strDrink}</h2>
      <p class="recipe-category">Category: ${drink.strCategory}</p>
      <br>
      <div class="recipe-ingredients">
          <br>
          <h3>Ingredients:</h3>
          <ul>
              ${ingredientsHtml}
          </ul>
      </div>
      <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${instructionsHtml}</p>
      </div>
      <div class="recipe-drink-img">
          <img src="${drink.strDrinkThumb}" alt="">
      </div>
  `;
  drinkDetailsContent.innerHTML = html;
  drinkDetailsContent.parentElement.classList.add('showRecipe');
}





      