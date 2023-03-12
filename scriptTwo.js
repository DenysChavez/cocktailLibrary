const drinkBox = document.getElementById('drink-result');
const drinkList = document.getElementById('drink');
const searchBtn = document.getElementById('search-btn');
const drinkDetailsContent = document.querySelector('.drink-details-content');
const recipeCloseBtn = document.getElementById('.recipe-close-btn');


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









      