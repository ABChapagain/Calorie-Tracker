// Storage Controller
const StorageCtrl = (function(){

    // Public methods
    return {
        storeItem: function(item){
            let items;
            // chek if any item in localstorage

            if(localStorage.getItem('items') ===  null){
                items = [];
                // push new item
                items.push(item);

                // Set local storage
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                // Get what is already in local storage
                items = JSON.parse(localStorage.getItem('items'));

                // Push the new item
                items.push(item);

                // Reset localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }

        },

        getItemsFromStorage: function(){
            let items = [];
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            // Reset localstorage
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            // Reset localstorage
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure
    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200 },
        //     // { id: 1, name: 'Cookies', calories: 400 },
        //     // { id: 2, name: 'Eggs', calories: 300 },
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function (id) {
            let found = null;
            // Loop through
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function (id) {
            // Get ids
            ids = data.items.map(function (item) {
                return item.id;
            });

            // Get Index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },

        updateItem: function (name, calories) {
            // calories to number
            calories = parseInt(calories);
            let found = null;
            // Loop through
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        clearAllItems: function () {
            data.items = [];
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        getCurrentItem: function () {
            return data.currentItem;
        },

        getTotalCalories: function () {
            let total = 0;

            // loop through items and add calories
            data.items.forEach(function (item) {
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            // return total
            return data.totalCalories;
        },

        logData: function () {
            return data;
        }
    }

})();




// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public Methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `
                    <li id="item-${item.id}" class="collection-item" id="item-0">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            });

            // Insert li items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = "block";
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
            `;

            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            // loop through
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },

        clearInput() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);

            //loop through
            listItems.forEach(function (item) {
                item.remove();
            });
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },

        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        getSelectors: function () {
            return UISelectors;
        }

    }

})();





// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load EventListeners
    const loadEventListeners = function () {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Clear button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit = function (e) {
        // Get Form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localstorage
            StorageCtrl.storeItem(newItem);

            // Clear Input
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual ID
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Item update submit
    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update in local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function (e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear all items event
    const clearAllItemsClick = function () {

        let sure = confirm("Are you sure!!?");

        if (sure === true) {
            // Delete all items from data structure
            ItemCtrl.clearAllItems();

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // remove from UI
            UICtrl.removeItems();

            // Clear from localstorage
            StorageCtrl.clearItemsFromStorage();

            // Hide the UL
            UICtrl.hideList();
        }

    }

    // Public methods 
    return {
        init: function () {
            // Clear edit state / set initaial set
            UICtrl.clearEditState();

            // Fetches items from Data Structure
            const items = ItemCtrl.getItems();

            // Check if any items?
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initializing
App.init();