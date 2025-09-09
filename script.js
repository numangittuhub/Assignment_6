
    fetch('https://openapi.programming-hero.com/api/plants')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const categoryList = document.getElementById('category_list');
        const cardContainer = document.getElementById('card_container');
        if (!categoryList || !cardContainer) {
          throw new Error('Required elements not found');
        }
        if (!data.plants || !Array.isArray(data.plants)) {
          throw new Error('Invalid data format: data.plants is not an array');
        }

        // ইউনিক ক্যাটাগরি সংগ্রহ
        const uniqueCategories = [...new Set(data.plants.map(item => item.category))];

        // ক্যাটাগরি লিস্ট তৈরি
        uniqueCategories.forEach(cat => {
          const listItem = document.createElement('li');
          listItem.textContent = cat;
          listItem.className = 'cursor-pointer hover:bg-green-200 transition text-xl';
          listItem.addEventListener('click', () => {
            // সব ক্যাটাগরি থেকে bg-green-500 রিমুভ
            document.querySelectorAll('#category_list li').forEach(item => {
              item.classList.remove('bg-green-500');
            });
            listItem.classList.add('bg-green-500');
            // কার্ডগুলো আপডেট
            loadCardsByCategory(cat, data.plants);
          });
          categoryList.appendChild(listItem);
        });

        // ডিফল্টভাবে প্রথম ক্যাটাগরির কার্ড লোড
        if (uniqueCategories.length > 0) {
          loadCardsByCategory(uniqueCategories[0], data.plants);
        }
      })
      .catch(error => {
        console.error('Error details:', error.message);
        const cardContainer = document.getElementById('card_container');
        if (cardContainer) {
          cardContainer.innerHTML = `<p class="text-red-500">Error loading data: ${error.message}</p>`;
        }
      });

    // ক্যাটাগরি অনুযায়ী কার্ড লোড করার ফাংশন
    function loadCardsByCategory(category, plants) {
      const cardContainer = document.getElementById('card_container');
      cardContainer.innerHTML = ''; // পূর্বের কার্ড মুছে ফেলা
      const filteredPlants = plants.filter(plant => plant.category === category);

      filteredPlants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'w-[250px] bg-white rounded-lg shadow-lg p-4';
        card.innerHTML = `
          <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg mb-4">
          <h3 class="text-lg font-semibold text-gray-800">${plant.name}</h3>
          <p class="text-sm text-gray-600 mt-2">${plant.description}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-sm text-green-600 font-medium">${plant.category}</span>
            <span class="text-sm text-gray-800 font-semibold">৳${plant.price}</span>
          </div>
          <button class="w-full bg-green-600 text-white font-medium py-2 rounded-lg mt-4 hover:bg-green-700 transition">Add to Cart</button>
        `;
        cardContainer.appendChild(card);
      });
    }