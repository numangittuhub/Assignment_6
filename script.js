document.addEventListener('DOMContentLoaded', () => {
  const categoryList = document.getElementById('category_list');
  const cardContainer = document.getElementById('card_container');
  const cardList = document.getElementById('cardList');
  const totalElement = document.getElementById('total');

  let cart = [];
  let total = 0;

  // Spinner 
  function showSpinner(container) {
    container.innerHTML = `
      <div class="flex items-center justify-center h-full mx-auto">
        <div class="spinner border-4 border-gray-300 border-t-4 border-t-green-600 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    `;
  }

  // All gach pala
  function loadAllPlants() {
    if (!cardContainer) {
      console.error('Card container not found');
      return;
    }

    showSpinner(cardContainer);

    fetch('https://openapi.programming-hero.com/api/plants')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.status && Array.isArray(data.plants)) {
          cardContainer.innerHTML = '';
          data.plants.forEach(plant => {
            const card = document.createElement('div');
            card.className = 'w-full max-w-[250px] bg-white rounded-lg shadow-lg p-4 m-2 gap-2';
            card.innerHTML = `
              <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg mb-2">
              <h3 class="text-lg font-semibold text-gray-800 cursor-pointer" onclick="openModal(${plant.id}, '${plant.name}', '${plant.image}', '${plant.description}', '${plant.category}', ${plant.price})">${plant.name}</h3>
              <p class="text-sm text-gray-600 mt-2">${plant.description}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="text-sm text-green-600 font-medium">${plant.category}</span>
                <span class="text-sm text-gray-800 font-semibold">৳${plant.price}</span>
              </div>
              <button class="w-full bg-green-600 text-white font-medium py-2 rounded-lg mt-4 hover:bg-green-700 transition" onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price})">Add to Cart</button>
            `;
            cardContainer.appendChild(card);
          });
        } else {
          cardContainer.innerHTML = '<p class="text-red-500">No plants data available</p>';
        }
      })
      .catch(error => {
        console.error('Error details:', error.message);
        cardContainer.innerHTML = `<p class="text-red-500">Error loading plants: ${error.message}</p>`;
      });
  }

  // Category- gach pala
  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!categoryList || !cardContainer) {
        throw new Error('Required elements not found');
      }
      if (!data.plants || !Array.isArray(data.plants)) {
        throw new Error('Invalid data format: data.plants is not an array');
      }

      // category selection
      const uniqueCategories = [...new Set(data.plants.map(item => item.category))];

        uniqueCategories.forEach(cat => {
        const listItem = document.createElement('li');
        listItem.textContent = cat;
        listItem.className = 'cursor-pointer hover:bg-green-200 transition text-xl';
        listItem.addEventListener('click', () => {
          showSpinner(cardContainer);
          setTimeout(() => {
            document.querySelectorAll('#category_list li').forEach(item => {
              item.classList.remove('bg-green-500');
            });
            listItem.classList.add('bg-green-500');
            loadCardsByCategory(cat, data.plants);
          }, 500); 
        });
        categoryList.appendChild(listItem);
      });

    //show all item
      showSpinner(cardContainer);
      setTimeout(() => {
        loadAllPlants();
      }, 500); 
    })
    .catch(error => {
      console.error('Error details:', error.message);
      if (cardContainer) {
        cardContainer.innerHTML = `<p class="text-red-500">Error loading data: ${error.message}</p>`;
      }
    });

  // showing selected category er gach pala
  function loadCardsByCategory(category, plants) {
    cardContainer.innerHTML = '';
    const filteredPlants = plants.filter(plant => plant.category === category);

    filteredPlants.forEach(plant => {
      const card = document.createElement('div');
      card.className = 'w-[80%] bg-white rounded-lg shadow-lg p-4 gap-2';
      card.innerHTML = `
        <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg mb-2">
        <h3 class="text-lg font-semibold text-gray-800 cursor-pointer" onclick="openModal(${plant.id}, '${plant.name}', '${plant.image}', '${plant.description}', '${plant.category}', ${plant.price})">${plant.name}</h3>
        <p class="text-sm text-gray-600 mt-2">${plant.description}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-sm text-green-600 font-medium">${plant.category}</span>
          <span class="text-sm text-gray-800 font-semibold">৳${plant.price}</span>
        </div>
        <button class="w-full bg-green-600 text-white font-medium py-2 rounded-lg mt-4 hover:bg-green-700 transition" onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price})">Add to Cart</button>
      `;
      cardContainer.appendChild(card);
    });
  }

  // Modal 
  window.openModal = function(id, name, image, description, category, price) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg- bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h3 class="text-lg font-semibold text-gray-800">${name}</h3>
        <img src="${image}" alt="${name}" class="w-full h-[300px] object-cover rounded-lg mb-4">
        <p class="text-sm text-gray-600 mt-2">${description}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-sm text-green-600 font-medium">${category}</span>
          <span class="text-sm text-gray-800 font-semibold">৳${price}</span>
        </div>
        <button class="mt-4 w-full bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition" onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  };

  // Cart adding
  window.addToCart = function(id, name, price) {
    let item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
  };

  // Cart update
  function updateCart() {
    cardList.innerHTML = '';
    total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const cartItem = document.createElement('div');
      cartItem.className = 'flex justify-between items-center py-2 border rounded-lg shadow-md bg-green-100 my-2 p-2';
      cartItem.innerHTML = `
        <div>
          <span class="block text-lg font-semibold">${item.name}</span>
          <span class="block text-sm text-gray-600">৳${item.price} x ${item.quantity}</span>
        </div>
        <span class="text-red-500 cursor-pointer bg-green-200 px-2 rounded" onclick="removeFromCart(${item.id})">&times;</span>
      `;
      cardList.appendChild(cartItem);
    });
    totalElement.textContent = `Total: ৳${total}`;
  }

  // card theeke ber kora
  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  };
});
