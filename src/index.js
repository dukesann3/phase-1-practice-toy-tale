let addToy = false;
const fetchBaseToy = 'http://localhost:3000/toys';
const toyCollectionContainer = document.querySelector('div#toy-collection');
const formDOM = document.querySelector('form.add-toy-form');
const newToyName = document.querySelector('input#new-toy-name');
const newToyImage = document.querySelector('input#new-toy-image');


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  getToys();

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  formDOM.addEventListener('submit', function (e) {
    e.preventDefault();
    postNewToy();
    console.log('clicked?');
  })

});

function getToys() {
  const toys = fetch(fetchBaseToy)
    .then(response => response.json())
    .then((toys) => {
      console.log(toys);
      for (let toy of toys) {
        //conains .name , .image , .likes
        createToy(toy);
        console.log(toy.image);
      }
    })
    .catch((error) => {
      console.log(error);
    })

  return toys;
}

function postNewToy() {
  //want to also search for duplicates.
  //won't fetch post unless toy name and toy src is not given
  if (!newToyName.value || !newToyImage.value) {
    alert('Need To Have New Toy Name Here');
    return;
  }

  const body = {
    name: newToyName.value,
    image: newToyImage.value,
    likes: 0
  }

  const newToy = fetch(fetchBaseToy, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then((data) => {
      //copy what I have in the GET fetch line.
      console.log(data);
      createToy(data);
    })
    .catch((error) => {
      console.log(error);
      alert('There was an error uploading new toy to server');
    })
  return newToy;
}


function createToy(toy) {
  //conains .name , .image , .likes
  const toyContainerDOM = document.createElement('div');
  const toyNameDOM = document.createElement('h2');
  const toyImageDOM = document.createElement('img');
  const toyLikesDOM = document.createElement('p');
  const likeButtonDOM = document.createElement('button');

  toyContainerDOM.classList.add('card');

  toyNameDOM.textContent = toy.name;
  toyContainerDOM.appendChild(toyNameDOM);

  toyImageDOM.setAttribute('src', toy.image);
  toyImageDOM.classList.add('toy-avatar');
  toyContainerDOM.appendChild(toyImageDOM);

  toyLikesDOM.textContent = `${toy.likes} Likes`;
  toyContainerDOM.appendChild(toyLikesDOM);

  likeButtonDOM.classList.add('like-btn');
  likeButtonDOM.setAttribute('id', 'toy_id');
  likeButtonDOM.addEventListener('click' , function(e){
    e.preventDefault();
    likePost(toy, toyLikesDOM);
  })
  toyContainerDOM.appendChild(likeButtonDOM);

  toyCollectionContainer.appendChild(toyContainerDOM);
}

function likePost(toy, likesDOM){
  toy.likes++;
  const requestURL = fetchBaseToy + '/' + toy.id

  const patchedReponse = fetch(requestURL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  })
  .then(response => response.json())
  .then((data) => {
    likesDOM.textContent = `${data.likes} Likes`;
  })
  .catch((error) => {
    console.log(error);
  });

  return patchedReponse;
}


