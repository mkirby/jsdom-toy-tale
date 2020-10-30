// DOM ELEMENTS
const toyCollection = document.querySelector("#toy-collection")
const newToyForm = document.querySelector(".add-toy-form")
let addToy = false;

// EVENT LISTENERS
newToyForm.addEventListener("submit", addNewToy)
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// EVENT HANDLERS
function likeToy(event) {
  const toyCard = event.target.closest(".card")
  const toyId = toyCard.dataset.id
  const pNode = toyCard.querySelector("p")
  const newLikeTotal = parseInt(pNode.textContent) + 1
  pNode.textContent = `${newLikeTotal} Likes`

  const configInfo = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: newLikeTotal})
  }
  
  fetch(`http://localhost:3000/toys/${toyId}`, configInfo)
    .then(response => response.json())
    .then(toy => console.log(toy))
}

// DOM MANIPULATION

function createToyCards(data) { data.forEach(toy => renderOneToyCard(toy))}

function renderOneToyCard(toy) {
  const toyCard = document.createElement("div")
    toyCard.classList.add("card")
    toyCard.dataset.id = toy.id

    const toyHeader = document.createElement("h1")
    toyHeader.textContent = toy.name

    const toyImg = document.createElement("img")
    toyImg.src = toy.image
    toyImg.alt = `Picture of ${toy.name} from Toy Tale`
    toyImg.classList.add("toy-avatar")
    
    const pNode = document.createElement("p")
    pNode.textContent = `${toy.likes} Likes`

    const likeButton = document.createElement("button")
    likeButton.classList.add("like-btn")
    likeButton.textContent = `Like <3`
    likeButton.addEventListener("click", likeToy)

    toyCard.append(toyHeader, toyImg, pNode, likeButton)
    toyCollection.append(toyCard)
}

function addNewToy(event) {
  event.preventDefault()

  const newToy = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  }

  const configInfo = {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newToy)
  }
  
  fetch("http://localhost:3000/toys", configInfo)
    .then(response => response.json())
    .then(toy => {
      //pessimistic render so I can add with data-id
      renderOneToyCard(toy)
    })

  newToyForm.reset()
}

function initialize() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      createToyCards(data)
    })
}

initialize()