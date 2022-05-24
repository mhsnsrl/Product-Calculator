// Storage Controller
const StorageController = (function () {
  const storeProduct = (product) => {
    let products = [];
    if (localStorage.getItem("products") === null) {
      products.push(product);
    } else {
      products = JSON.parse(localStorage.getItem("products"));
      products.push(product);
    }
    localStorage.setItem("products", JSON.stringify(products));
  };
  const getProducts = () => {
    let products = [];
    if (localStorage.getItem("products") != null) {
      products = JSON.parse(localStorage.getItem("products"));
    }
    return products;
  };
  const updateProduct = (product) => {
    let products = JSON.parse(localStorage.getItem("products"));
    products.forEach((prd, index) => {
      if (product.id == prd.id) {
        products.splice(index, 1, product);
      }
    });
    localStorage.setItem("products", JSON.stringify(products));
  };
  const deleteProduct = (id) => {
    let products = JSON.parse(localStorage.getItem("products"));
    products.forEach((prd, index) => {
      if (id == prd.id) {
        products.splice(index, 1);
      }
    });
    localStorage.setItem("products", JSON.stringify(products));
  };
  return {
    storeProduct,
    getProducts,
    updateProduct,
    deleteProduct,
  };
})();

//Product Controller
const ProductController = (function () {
  //This is product
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };
  //This data is , it includes products ,Selected Products and Total Price
  //This data is like a shopping cart
  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };
  const getProductById = (id) => {
    let product = null;
    data.products.forEach((prd) => {
      if (prd.id == id) product = prd;
    });

    return product;
  };
  const setCurrentProduct = (product) => (data.selectedProduct = product);
  const getCurrentProduct = () => data.selectedProduct;
  const getProducts = () => data.products; //Public Func // Returns products from data
  const getData = () => data; //Public Func // Returns data

  const addProduct = (name, price) => {
    let id;
    if (data.products.length > 0) {
      id = data.products[data.products.length - 1].id + 1;
    } else {
      id = 0;
    }

    const newProduct = new Product(id, name, parseFloat(price));
    data.products.push(newProduct);
    return newProduct;
  };
  const updateProduct = (name, price) => {
    let product = null;
    data.products.forEach((prd) => {
      if (prd.id == data.selectedProduct.id) {
        prd.name = name;
        prd.price = parseFloat(price);
        product = prd;
      }
    });
    return product;
  };
  const deleteProduct = (product) => {
    data.products.forEach((prd, index) => {
      if (prd.id == product.id) {
        data.products.splice(index, 1);
      } else {
      }
    });
  };
  const getTotal = () => {
    let total = 0;

    data.products.forEach((item) => (total += item.price));
    data.totalPrice = total;
    return data.totalPrice;
  };
  //public
  return {
    getProducts,
    getData,
    addProduct,
    getTotal,
    getProductById,
    setCurrentProduct,
    getCurrentProduct,
    updateProduct,
    deleteProduct,
  };
})();

//UI Controller
//This module is responsible for the whole user interface.
const UIController = (function () {
  querySelector = (selectors) => document.querySelector(selectors);
  const selectors = {
    productList: querySelector("#item-list"),
    addButton: querySelector("#addBtn"),
    updateButton: querySelector("#updateBtn"),
    cancelButton: querySelector("#cancelBtn"),
    deleteButton: querySelector("#deleteBtn"),
    productName: querySelector("#productName"),
    productPrice: querySelector("#productPrice"),
    productCard: querySelector("#productCard"),
    totalTL: querySelector("#total-tl"),
    totalUsd: querySelector("#total-usd"),
  };
  const getSelectors = () => selectors;
  const createProductList = (products) => {
    //This function renders the products sent into it on the screen.
    let html = ``;
    products.forEach((prd) => {
      html += `<tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-end">
                                <i class="far fa-edit edit-product"></i>
                        </td>
                    </tr>`;
    });

    selectors.productList.innerHTML = html;
  };

  const addProduct = (prd) => {
    selectors.productCard.style.display = "block";
    var item = `<tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-end">
                        <i class="far fa-edit edit-product"></i>
                    </td>
                </tr>`;
    selectors.productList.innerHTML += item;
  };

  const deleteProduct = () => {
    let items = document.querySelectorAll("#item-list tr");
    items.forEach((item) => {
      console.log("deleteproduct");
      if (item.classList.contains("bg-warning")) {
        item.remove();
      }
    });
  };

  const updateProduct = (prd) => {
    let updatedItem = null;

    let items = document.querySelectorAll("#item-list tr");
    console.log(items);
    items.forEach((item) => {
      console.log("update product");

      if (item.classList.contains("bg-warning")) {
        console.log("update product");
        item.children[1].innerHTML = prd.name;
        item.children[2].innerHTML = prd.price + " $";
        updatedItem = item;
      }
    });

    return updatedItem;
  };

  const clearInputs = () => {
    selectors.productName.value = "";
    selectors.productPrice.value = "";
  };
  const clearWarnings = () => {
    const items = document.querySelectorAll("#item-list tr");
    items.forEach((item) => {
      if (item.classList.contains("bg-warning")) {
        item.classList.remove("bg-warning");
      }
    });
  };

  const hideCard = () => {
    selectors.productCard.style.display = "none";
  };

  const showTotal = (total) => {
    selectors.totalUsd.textContent = total;
    selectors.totalTL.textContent = total * 16;
  };

  const addProductToForm = () => {
    const selectedProduct = ProductController.getCurrentProduct();
    selectors.productName.value = selectedProduct.name;
    selectors.productPrice.value = selectedProduct.price;
  };
  const addingState = (item) => {
    UIController.clearWarnings();
    UIController.clearInputs();
    selectors.addButton.style.display = "inline";
    selectors.updateButton.style.display = "none";
    selectors.deleteButton.style.display = "none";
    selectors.cancelButton.style.display = "none";
  };
  const editState = (tr) => {
    tr.classList.add("bg-warning");
    selectors.addButton.style.display = "none";
    selectors.updateButton.style.display = "inline";
    selectors.deleteButton.style.display = "inline";
    selectors.cancelButton.style.display = "inline";
  };

  return {
    createProductList,
    getSelectors,
    addProduct,
    clearInputs,
    hideCard,
    showTotal,
    addProductToForm,
    addingState,
    editState,
    updateProduct,
    clearWarnings,
    deleteProduct,
  };
})();

//App Controller
//This function manage the whole application
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();
  //Load Event Listeners
  const loadEventListeners = () => {
    //add product event
    UISelectors.addButton.addEventListener("click", productAddSubmit);
    //edit product click
    UISelectors.productList.addEventListener("click", productEditClick);
    //edit product submit
    UISelectors.updateButton.addEventListener("click", editProductSubmit);
    //cancel button click
    UISelectors.cancelButton.addEventListener("click", cancelUpdate);
    //delete product
    UISelectors.deleteButton.addEventListener("click", deleteProductSubmit);
  };
  const productAddSubmit = (e) => {
    const productName = UISelectors.productName.value;
    const productPrice = UISelectors.productPrice.value;

    if (productName !== "" && productPrice !== "") {
      //add product
      const newProduct = ProductCtrl.addProduct(productName, productPrice);
      //add item to list
      UICtrl.addProduct(newProduct);

      //add product to Local Storage
      StorageCtrl.storeProduct(newProduct);
      //get total
      const total = ProductCtrl.getTotal();

      // showtotal
      UICtrl.showTotal(total);

      //clear inputs
      UICtrl.clearInputs();
    }
    console.log(productName, productPrice);

    e.preventDefault();
  };
  const productEditClick = (e) => {
    if (e.target.classList.contains("edit-product")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;
      //get selected product
      const product = ProductCtrl.getProductById(id);
      //set current product
      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      //add product to UI
      UICtrl.addProductToForm();

      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  };
  const editProductSubmit = (e) => {
    const productName = UISelectors.productName.value;
    const productPrice = UISelectors.productPrice.value;
    if (productName !== "" && productPrice !== "") {
      //update product
      const updatedProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );
      //update ui
      let item = UICtrl.updateProduct(updatedProduct);
      //get total
      const total = ProductCtrl.getTotal();
      //show total
      UICtrl.showTotal(total);
      //update storage
      StorageCtrl.updateProduct(updatedProduct);
      UICtrl.addingState();
    }
    e.preventDefault();
  };
  const cancelUpdate = (e) => {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    e.preventDefault();
  };
  const deleteProductSubmit = (e) => {
    //get selected product
    const selectedProduct = ProductCtrl.getCurrentProduct();
    //delete product
    ProductCtrl.deleteProduct(selectedProduct);
    //delete ui
    UICtrl.deleteProduct(selectedProduct);
    //get total
    const total = ProductCtrl.getTotal();
    //show total
    UICtrl.showTotal(total);
    //delete from storage
    StorageCtrl.deleteProduct(selectedProduct.id);
    //adding state
    UICtrl.addingState();

    if (ProductCtrl.getProducts().length == 0) {
      UICtrl.hideCard();
    }

    e.preventDefault();
  };
  const __init__ = () => {
    //This function works when the app is opened
    console.log("Starting App");
    //get total
    const total = ProductCtrl.getTotal();

    // showtotal
    UICtrl.showTotal(total);

    UICtrl.addingState();
    const products = ProductCtrl.getProducts();

    if (products.length == 0) {
      UICtrl.hideCard();
    } else {
      UICtrl.createProductList(products);
    }

    //Load event listener
    loadEventListeners();
  };

  return {
    __init__,
  };
})(ProductController, UIController, StorageController);
App.__init__();
