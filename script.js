const searchBtn = document.getElementById('search-btn');
const drinkList = document.getElementById('drink');
const drinkDetailsContent = document.querySelector('.drink-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

//event listeners
searchBtn.addEventListener('click', getDrinkList);
drinkList.addEventListener('click', getDrinkRecipe);
recipeCloseBtn.addEventListener('click', () => {
    drinkDetailsContent.parentElement.classList.remove('showRecipe');
});

//get drink list that matches with the ingredients
function getDrinkList() {
    let searchInputText = document.getElementById('search-input').value.trim();
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
        }).catch(error => {
            drinkList.innerHTML = "Sorry We couldn't find a drink";
            console.log(error);
        })
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

// create a modal
function drinkRecipeModal(drink) {
    drink = drink[0];
    console.log(drink);

    //save ingredients in an object
    console.log('keys:');
    let ingredients = Object.fromEntries(Object.entries(drink).filter(([key, value]) => key.includes("strIngredient")));
    let measures = Object.fromEntries(Object.entries(drink).filter(([key, value]) => key.includes("strMeasure")));

    // coctail variable holds our merged data witouth null keys and change value of keys where their values are null 
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
    // create the ingredientes HTML list
    let ingredientsHtml = "";
    for (let key in cocktail) {
        ingredientsHtml += `<li>${key}: ${cocktail[key]}</li>`
    }

    //save instructions
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