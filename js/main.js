// ==============================
// Éléments du panier
// ==============================

let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let cartCount = document.querySelector('.cart-count');
let emptyCartMessage = document.querySelector('.empty-cart-message');
let favoritesContent = document.getElementById("favorites-content");
let favorites = [];


// ==============================
// Ouvrir le panier
// ==============================

cartIcon.onclick = () => {
    cart.classList.add("active");
};


// ==============================
// Fermer le panier
// ==============================

closeCart.onclick = () => {
    cart.classList.remove("active");
};


// ==============================
// Initialisation
// ==============================

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}


// ==============================
// Fonction principale
// ==============================

function ready() {

    // Ajouter les produits au panier
    var addCart = document.getElementsByClassName("add-cart");

    for (var i = 0; i < addCart.length; i++) {

        var button = addCart[i];

        button.addEventListener("click", addCartClicked);
    }


    // Bouton commander
    document.getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);


    // Code promo
    document.getElementById("promo-button")
        .addEventListener("click", applyPromo);


    // Charger le panier sauvegardé
    loadCart();


    // Mettre à jour l'affichage
    updateCart();
    
        setupSearch();

    setupCategories();

    setupSort();

    setupProductModal();

    setupFavorites();

    loadFavorites();
}


// ==============================
// Ajouter un produit
// ==============================

function addCartClicked(event) {

    var button = event.target;

    var shopProducts = button.parentElement;

    var sizeType =
        shopProducts.getAttribute("data-size-type");

    // Les produits avec taille/pointure
    // doivent passer par la fiche produit
    if (sizeType !== "none") {

        openProductModal({
            currentTarget: shopProducts,
            target: shopProducts
        });

        return;
    }

    var title = shopProducts
        .getElementsByClassName("product-title")[0]
        .innerText;

    var price = shopProducts
        .getElementsByClassName("price")[0]
        .innerText;

    var productImg = shopProducts
        .getElementsByClassName("product-img")[0]
        .src;

    addProductToCart(
        title,
        price,
        productImg,
        null
    );

    updateCart();

    saveCart();
}


// ==============================
// Ajouter au panier
// ==============================

function addProductToCart(
    title,
    price,
    productImg,
    size
) {

    var cartItems =
        document.getElementsByClassName("cart-content")[0];

    var cartItemsNames =
        cartItems.getElementsByClassName("cart-product-title");


    // Vérifier si le produit + la taille existent déjà
    for (var i = 0; i < cartItemsNames.length; i++) {

        var cartBox =
            cartItemsNames[i].closest(".cart-box");

        var existingSizeElement =
            cartBox.getElementsByClassName("cart-product-size")[0];

        var existingSize =
            existingSizeElement
                ? existingSizeElement.getAttribute("data-size")
                : null;


        if (
            cartItemsNames[i].innerText == title &&
            existingSize == size
        ) {

            var quantityInput =
                cartBox.getElementsByClassName("cart-quantity")[0];

            quantityInput.value =
                parseInt(quantityInput.value) + 1;

            updateCart();

            saveCart();

            return;
        }
    }


    // Créer le produit dans le panier
    var cartShopBox =
        document.createElement("div");

    cartShopBox.classList.add("cart-box");


    // Afficher la taille uniquement si elle existe
    var sizeHTML = "";

    if (size) {

        var sizeLabel = "Taille";

        // Les chaussures utilisent "Pointure"
        var productCards =
            document.getElementsByClassName("product-card");

        for (var i = 0; i < productCards.length; i++) {

            var productTitle =
                productCards[i]
                    .getElementsByClassName("product-title")[0]
                    .innerText;

            if (productTitle == title) {

                if (
                    productCards[i]
                        .getAttribute("data-size-type") === "shoes"
                ) {
                    sizeLabel = "Pointure";
                }

                break;
            }
        }

        sizeHTML = `
            <div
                class="cart-product-size"
                data-size="${size}"
            >
                ${sizeLabel} : ${size}
            </div>
        `;
    }


    var cartBoxContent = `

        <img src="${productImg}" alt="" class="cart-img">

        <div class="detail-box">

            <div class="cart-product-title">
                ${title}
            </div>

            ${sizeHTML}

            <div class="cart-price">
                Prix unitaire : ${price}
            </div>

            <div class="quantity-box">

                <button
                    type="button"
                    class="quantity-btn quantity-minus">
                    −
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                    class="cart-quantity"
                    readonly
                >

                <button
                    type="button"
                    class="quantity-btn quantity-plus">
                    +
                </button>

            </div>

            <div class="cart-subtotal">
                Sous-total : ${price}
            </div>

        </div>

        <i class='bx bxs-trash-alt cart-remove'></i>
    `;


    cartShopBox.innerHTML =
        cartBoxContent;

    cartItems.append(cartShopBox);


    // Bouton supprimer
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener(
            "click",
            removeCartItem
        );


    // Bouton -
    cartShopBox
        .getElementsByClassName("quantity-minus")[0]
        .addEventListener(
            "click",
            decreaseQuantity
        );


    // Bouton +
    cartShopBox
        .getElementsByClassName("quantity-plus")[0]
        .addEventListener(
            "click",
            increaseQuantity
        );
}


// ==============================
// Augmenter quantité
// ==============================

function increaseQuantity(event) {

    var button = event.target;


    var cartBox =
        button.closest(".cart-box");


    var input =
        cartBox.getElementsByClassName("cart-quantity")[0];


    input.value =
        parseInt(input.value) + 1;


    updateCart();

    saveCart();
}


// ==============================
// Diminuer quantité
// ==============================

function decreaseQuantity(event) {

    var button = event.target;


    var cartBox =
        button.closest(".cart-box");


    var input =
        cartBox.getElementsByClassName("cart-quantity")[0];


    if (parseInt(input.value) > 1) {

        input.value =
            parseInt(input.value) - 1;

    } else {

        cartBox.remove();
    }


    updateCart();

    saveCart();
}


// ==============================
// Supprimer un produit
// ==============================

function removeCartItem(event) {

    var buttonClicked =
        event.target;


    buttonClicked
        .closest(".cart-box")
        .remove();


    updateCart();

    saveCart();
}


// ==============================
// Code promo
// ==============================

let promoApplied = false;


function applyPromo() {

    var promoInput =
        document.getElementById("promo-code");


    var promoMessage =
        document.getElementById("promo-message");


    var code =
        promoInput.value
            .trim()
            .toUpperCase();


    if (code === "PROMO10") {

        promoApplied = true;


        promoMessage.innerText =
            "Code promo appliqué : -10 %";


        updateCart();

        saveCart();

    } else {

        promoApplied = false;


        promoMessage.innerText =
            "Code promo invalide.";


        updateCart();

        saveCart();
    }
}


// ==============================
// Sauvegarder le panier
// ==============================

function saveCart() {

    var cartBoxes =
        document
            .getElementsByClassName("cart-content")[0]
            .getElementsByClassName("cart-box");


    var cartData = [];


    // Récupérer chaque produit
    for (var i = 0; i < cartBoxes.length; i++) {

        var cartBox =
            cartBoxes[i];


        var title =
            cartBox
                .getElementsByClassName("cart-product-title")[0]
                .innerText;


        var price =
            cartBox
                .getElementsByClassName("cart-price")[0]
                .innerText;


        var image =
            cartBox
                .getElementsByClassName("cart-img")[0]
                .src;


        var quantity =
            cartBox
                .getElementsByClassName("cart-quantity")[0]
                .value;

        var sizeElement =
            cartBox.getElementsByClassName("cart-product-size")[0];

        var size = null;

        if (sizeElement) {

            size =
                sizeElement.getAttribute("data-size");
        }


cartData.push({

    title: title,

    price: price,

    image: image,

    quantity: quantity,

    size: size

        });
    }


    // Sauvegarder le panier
    localStorage.setItem(
        "cart",
        JSON.stringify(cartData)
    );


    // Sauvegarder le code promo
    localStorage.setItem(
        "promoApplied",
        promoApplied
    );
}


// ==============================
// Charger le panier
// ==============================

function loadCart() {

    var savedCart =
        localStorage.getItem("cart");


    var savedPromo =
        localStorage.getItem("promoApplied");


    // Restaurer le code promo
    if (savedPromo === "true") {

        promoApplied = true;

        document.getElementById("promo-code").value =
            "PROMO10";

        document.getElementById("promo-message").innerText =
            "Code promo appliqué : -10 %";
    }


    // Aucun panier sauvegardé
    if (!savedCart) {

        return;
    }


    var cartData =
        JSON.parse(savedCart);


    // Si le panier est vide
    if (cartData.length === 0) {

        return;
    }


    // Ajouter chaque produit sauvegardé
    for (var i = 0; i < cartData.length; i++) {

        addSavedProductToCart(cartData[i]);
    }
}


// ==============================
// Restaurer un produit
// ==============================

function addSavedProductToCart(product) {

    var cartItems =
        document.getElementsByClassName("cart-content")[0];


    var cartShopBox =
        document.createElement("div");


    cartShopBox.classList.add("cart-box");


    var cartBoxContent = `
        <img src="${product.image}" alt="" class="cart-img">

        <div class="detail-box">

            <div class="cart-product-title">
                ${product.title}
            </div>

            <div class="cart-price">
                ${product.price}
            </div>

            <div class="quantity-box">

                <button type="button" class="quantity-btn quantity-minus">
                    −
                </button>

                <input
                    type="number"
                    value="${product.quantity}"
                    min="1"
                    class="cart-quantity"
                    readonly
                >

                <button type="button" class="quantity-btn quantity-plus">
                    +
                </button>

            </div>

            <div class="cart-subtotal">
                Sous-total : 0,00 €
            </div>

        </div>

        <i class='bx bxs-trash-alt cart-remove'></i>
    `;


    cartShopBox.innerHTML =
        cartBoxContent;


    cartItems.append(cartShopBox);


    // Bouton supprimer
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeCartItem);


    // Bouton -
    cartShopBox
        .getElementsByClassName("quantity-minus")[0]
        .addEventListener("click", decreaseQuantity);


    // Bouton +
    cartShopBox
        .getElementsByClassName("quantity-plus")[0]
        .addEventListener("click", increaseQuantity);
}


// ==============================
// Mettre à jour le panier
// ==============================

function updateCart() {

    var cartContent =
        document.getElementsByClassName("cart-content")[0];


    var cartBoxes =
        cartContent.getElementsByClassName("cart-box");


    var subtotal = 0;

    var itemCount = 0;


    // Calcul des produits
    for (var i = 0; i < cartBoxes.length; i++) {

        var cartBox =
            cartBoxes[i];


        var priceElement =
            cartBox
                .getElementsByClassName("cart-price")[0];


        var quantityElement =
            cartBox
                .getElementsByClassName("cart-quantity")[0];


        var subtotalElement =
            cartBox
                .getElementsByClassName("cart-subtotal")[0];


        // Récupérer le prix
        var priceText =
            priceElement.innerText
                .replace("Prix unitaire :", "")
                .replace("€", "")
                .replace(",", ".")
                .trim();


        var price =
            parseFloat(priceText);


        var quantity =
            parseInt(quantityElement.value);


        // Sous-total produit
        var productSubtotal =
            price * quantity;


        subtotal += productSubtotal;

        itemCount += quantity;


        // Afficher le sous-total du produit
        subtotalElement.innerText =
            "Sous-total : " +
            productSubtotal
                .toFixed(2)
                .replace(".", ",") +
            " €";
    }


    // Réduction
    var discount = 0;


    if (promoApplied) {

        discount =
            subtotal * 0.10;
    }


    // Livraison
    var shipping = 0;


    if (cartBoxes.length > 0) {

        shipping = 4.99;
    }


    // Total
    var total =
        subtotal + shipping - discount;


    // Sous-total
    document.getElementsByClassName("subtotal-price")[0]
        .innerText =
        subtotal
            .toFixed(2)
            .replace(".", ",") +
        " €";


    // Livraison
    document.getElementsByClassName("shipping-price")[0]
        .innerText =
        shipping
            .toFixed(2)
            .replace(".", ",") +
        " €";


    // Réduction
    document.getElementsByClassName("discount-price")[0]
        .innerText =
        "-" +
        discount
            .toFixed(2)
            .replace(".", ",") +
        " €";


    // Total
    document.getElementsByClassName("total-price")[0]
        .innerText =
        total
            .toFixed(2)
            .replace(".", ",") +
        " €";


    // Badge panier
    cartCount.innerText =
        itemCount;


    // Afficher/cacher le message panier vide
    if (cartBoxes.length === 0) {

        emptyCartMessage.style.display =
            "block";

    } else {

        emptyCartMessage.style.display =
            "none";
    }


    // Cacher le badge si panier vide
    if (itemCount === 0) {

        cartCount.style.display =
            "none";

    } else {

        cartCount.style.display =
            "flex";
    }
}


// ==============================
// Bouton commander
// ==============================

function buyButtonClicked() {

    var cartContent =
        document.getElementsByClassName("cart-content")[0];


    var cartBoxes =
        cartContent.getElementsByClassName("cart-box");


    if (cartBoxes.length === 0) {

        alert("Votre panier est vide.");

        return;
    }


    alert("Votre commande a été passée !");


    // Vider le panier
    while (cartContent.hasChildNodes()) {

        cartContent.removeChild(
            cartContent.firstChild
        );
    }


    // Réinitialiser la promo
    promoApplied = false;


    document.getElementById("promo-code").value =
        "";


    document.getElementById("promo-message").innerText =
        "";


    // Supprimer les données sauvegardées
    localStorage.removeItem("cart");

    localStorage.removeItem("promoApplied");


    updateCart();
}
// ==============================
// Recherche et catégories
// ==============================

let selectedCategory = "all";
let selectedSort = "default";


// ==============================
// Recherche de produits
// ==============================

function setupSearch() {

    var searchInput =
        document.getElementById("search-input");


    searchInput.addEventListener("input", function () {

        filterProducts();

    });
}


// ==============================
// Catégories
// ==============================

function setupCategories() {

    var categoryButtons =
        document.getElementsByClassName("category-btn");


    for (var i = 0; i < categoryButtons.length; i++) {

        categoryButtons[i].addEventListener("click", function () {

            // Récupérer la catégorie sélectionnée
            selectedCategory =
                this.getAttribute("data-category");


            // Retirer la classe active des boutons
            for (var j = 0; j < categoryButtons.length; j++) {

                categoryButtons[j]
                    .classList
                    .remove("active");
            }


            // Activer le bouton sélectionné
            this.classList.add("active");


            // Filtrer les produits
            filterProducts();

        });
    }
}

// ==============================
// Tri des produits
// ==============================

function setupSort() {

    var sortSelect =
        document.getElementById("sort-select");


    sortSelect.addEventListener("change", function () {

        selectedSort =
            this.value;


        sortProducts();

    });
}

// ==============================
// Trier les produits
// ==============================

function sortProducts() {

    var shopContent =
        document.getElementsByClassName("shop-content")[0];


    var products =
        Array.from(
            shopContent.getElementsByClassName("product-box")
        );


    products.sort(function (a, b) {

        // Prix
        var priceA =
            parseFloat(
                a.getElementsByClassName("price")[0]
                    .innerText
                    .replace("€", "")
                    .replace(",", ".")
                    .trim()
            );


        var priceB =
            parseFloat(
                b.getElementsByClassName("price")[0]
                    .innerText
                    .replace("€", "")
                    .replace(",", ".")
                    .trim()
            );


        // Nom
        var nameA =
            a.getElementsByClassName("product-title")[0]
                .innerText
                .toLowerCase();


        var nameB =
            b.getElementsByClassName("product-title")[0]
                .innerText
                .toLowerCase();


        // Prix croissant
        if (selectedSort === "price-asc") {

            return priceA - priceB;
        }


        // Prix décroissant
        if (selectedSort === "price-desc") {

            return priceB - priceA;
        }


        // Nom A → Z
        if (selectedSort === "name-asc") {

            return nameA.localeCompare(nameB);
        }


        // Nom Z → A
        if (selectedSort === "name-desc") {

            return nameB.localeCompare(nameA);
        }


        return 0;
    });


    // Réorganiser les produits dans la boutique
    for (var i = 0; i < products.length; i++) {

        shopContent.appendChild(products[i]);

    }
}

// ==============================
// Filtrer les produits
// ==============================

function filterProducts() {

    var searchInput =
        document.getElementById("search-input");


    var searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    var products =
        document.getElementsByClassName("product-box");


    for (var i = 0; i < products.length; i++) {

        var product =
            products[i];


        var productTitle =
            product
                .getElementsByClassName("product-title")[0]
                .innerText
                .toLowerCase();


        var productCategory =
            product.getAttribute("data-category");


        // Vérifier la recherche
        var matchesSearch =
            productTitle.includes(searchText);


        // Vérifier la catégorie
        var matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;


        // Afficher uniquement si les deux conditions sont respectées
        if (matchesSearch && matchesCategory) {

            product.style.display = "";

        } else {

            product.style.display = "none";
        }
    }
    // Appliquer le tri
    sortProducts();
}

// ==============================
// Fiche produit
// ==============================

let selectedProduct = null;
let modalQuantity = 1;
let selectedSize = null;


// ==============================
// Initialisation fiche produit
// ==============================

function setupProductModal() {

    var products =
        document.getElementsByClassName("product-card");

    var modal =
        document.querySelector(".product-modal");

    var closeButton =
        document.querySelector(".product-modal-close");

    var minusButton =
        document.getElementById("modal-quantity-minus");

    var plusButton =
        document.getElementById("modal-quantity-plus");

    var addButton =
        document.getElementById("modal-add-cart");


    // Cliquer sur un produit
    for (var i = 0; i < products.length; i++) {

        products[i].addEventListener("click", openProductModal);

    }


    // Fermer
    closeButton.addEventListener("click", closeProductModal);


    // Quantité -
    minusButton.addEventListener("click", function () {

        if (modalQuantity > 1) {

            modalQuantity--;

            updateModalQuantity();

        }

    });


    // Quantité +
    plusButton.addEventListener("click", function () {

        modalQuantity++;

        updateModalQuantity();

    });


    // Ajouter au panier
    addButton.addEventListener("click", addModalProductToCart);


    // Cliquer sur le fond
    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            closeProductModal();

        }

    });

}

// ==============================
// Ouvrir la fiche produit
// ==============================

function openProductModal(event) {

    // Ne pas ouvrir la fiche si on clique sur le bouton panier
    if (event.target.classList.contains("add-cart")) {

        return;

    }


    selectedProduct =
        event.currentTarget;


    var title =
        selectedProduct
            .getElementsByClassName("product-title")[0]
            .innerText;


    var price =
        selectedProduct
            .getElementsByClassName("price")[0]
            .innerText;


    var image =
        selectedProduct
            .getElementsByClassName("product-img")[0]
            .src;


    var description =
        selectedProduct
            .getAttribute("data-description");


    // Récupérer le type de taille
    var sizeType =
        selectedProduct
            .getAttribute("data-size-type");


    // Afficher les informations du produit
    document.getElementById("modal-product-title")
        .innerText = title;


    document.getElementById("modal-product-price")
        .innerText = price;


    document.getElementById("modal-product-img")
        .src = image;


    document.getElementById("modal-product-description")
        .innerText = description;


    // Réinitialiser la quantité
    modalQuantity = 1;

    updateModalQuantity();


    // Réinitialiser la taille
    selectedSize = null;


    // Afficher les bonnes tailles
    setupProductSizes(sizeType);


    // Afficher la fiche
    document.querySelector(".product-modal")
        .classList.add("active");

}

// ==============================
// Afficher les tailles
// ==============================

function setupProductSizes(sizeType) {

    var sizeContainer =
        document.getElementById("product-size-container");

    var sizeLabel =
        document.getElementById("product-size-label");

    var sizeOptions =
        document.getElementById("size-options");


    // Vider les anciennes options
    sizeOptions.innerHTML = "";


    // Aucun choix de taille
    if (sizeType === "none") {

        sizeContainer.style.display = "none";

        return;

    }


    // Afficher la zone de taille
    sizeContainer.style.display = "block";


    var sizes = [];


    // Vêtements
    if (sizeType === "clothing") {

        sizeLabel.innerText = "Taille :";

        sizes = ["S", "M", "L", "XL"];

    }


    // Chaussures
    if (sizeType === "shoes") {

        sizeLabel.innerText = "Pointure :";

        sizes = ["40", "41", "42", "43", "44"];

    }


    // Créer les boutons
    for (var i = 0; i < sizes.length; i++) {

        var button =
            document.createElement("button");

        button.type = "button";

        button.classList.add("size-btn");

        button.innerText = sizes[i];


        button.addEventListener("click", function () {

            var allSizeButtons =
                document.getElementsByClassName("size-btn");


            // Retirer la sélection précédente
            for (var j = 0; j < allSizeButtons.length; j++) {

                allSizeButtons[j]
                    .classList
                    .remove("active");

            }


            // Sélectionner le bouton
            this.classList.add("active");


            selectedSize =
                this.innerText;

        });


        sizeOptions.appendChild(button);

    }

}


// ==============================
// Fermer la fiche produit
// ==============================

function closeProductModal() {

    document.querySelector(".product-modal")
        .classList.remove("active");

}


// ==============================
// Modifier quantité fiche produit
// ==============================

function updateModalQuantity() {

    document.getElementById("modal-quantity")
        .innerText = modalQuantity;

}

// ==============================
// Ajouter depuis la fiche produit
// ==============================

function addModalProductToCart() {

    if (!selectedProduct) {

        return;
    }

    var title =
        selectedProduct
            .getElementsByClassName("product-title")[0]
            .innerText;

    var price =
        selectedProduct
            .getElementsByClassName("price")[0]
            .innerText;

    var image =
        selectedProduct
            .getElementsByClassName("product-img")[0]
            .src;

    var sizeType =
        selectedProduct
            .getAttribute("data-size-type");


    // Vérifier la taille/pointure
    if (
        sizeType !== "none" &&
        !selectedSize
    ) {

        alert(
            "Veuillez sélectionner une taille ou une pointure."
        );

        return;
    }

    // Ajouter la quantité choisie
    for (var i = 0; i < modalQuantity; i++) {

        addProductToCart(
            title,
            price,
            image,
            selectedSize
        );
    }

    updateCart();

    saveCart();

    // Fermer la fiche
    closeProductModal();
}

// ==============================
// Système de favoris
// ==============================

function setupFavorites() {

    var favoriteButtons =
        document.getElementsByClassName(
            "favorite-icon"
        );


    for (
        var i = 0;
        i < favoriteButtons.length;
        i++
    ) {

        favoriteButtons[i]
            .addEventListener(
                "click",
                toggleFavorite
            );
    }
}


// ==============================
// Ajouter / retirer un favori
// ==============================

function toggleFavorite(event) {

    event.stopPropagation();


    var button =
        event.currentTarget;


    var product =
        button.closest(".product-card");


    var title =
        product
            .getElementsByClassName(
                "product-title"
            )[0]
            .innerText;


    var image =
        product
            .getElementsByClassName(
                "product-img"
            )[0]
            .src;


    var price =
        product
            .getElementsByClassName(
                "price"
            )[0]
            .innerText;


    var existingFavorite =
        favorites.find(function (favorite) {

            return favorite.title === title;

        });


    // Retirer des favoris
    if (existingFavorite) {

        favorites =
            favorites.filter(
                function (favorite) {

                    return favorite.title !== title;

                }
            );

        button.classList.remove("bxs-heart");
        button.classList.add("bx-heart");

    }

    // Ajouter aux favoris
    else {

        favorites.push({

            title: title,

            image: image,

            price: price
        });


        button.classList.remove("bx-heart");
        button.classList.add("bxs-heart");
    }


    saveFavorites();

    displayFavorites();
}


// ==============================
// Sauvegarder les favoris
// ==============================

function saveFavorites() {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}


// ==============================
// Charger les favoris
// ==============================

function loadFavorites() {

    var savedFavorites =
        localStorage.getItem(
            "favorites"
        );


    if (!savedFavorites) {

        favorites = [];

        displayFavorites();

        return;
    }


    favorites =
        JSON.parse(savedFavorites);


    var products =
        document.getElementsByClassName(
            "product-card"
        );


    // Remettre les cœurs en rouge
    for (
        var i = 0;
        i < products.length;
        i++
    ) {

        var title =
            products[i]
                .getElementsByClassName(
                    "product-title"
                )[0]
                .innerText;


        var isFavorite =
            favorites.some(
                function (favorite) {

                    return favorite.title === title;

                }
            );


        if (isFavorite) {

            var heart =
                products[i]
                    .getElementsByClassName(
                        "favorite-icon"
                    )[0];


            heart.classList.remove(
                "bx-heart"
            );

            heart.classList.add(
                "bxs-heart"
            );
        }
    }


    displayFavorites();
}


// ==============================
// Afficher les favoris
// ==============================

function displayFavorites() {

    if (!favoritesContent) {
        return;
    }


    favoritesContent.innerHTML = "";


    // Aucun favori
    if (favorites.length === 0) {

        favoritesContent.innerHTML = `

            <p class="empty-favorites">
                Vous n'avez aucun produit en favori.
            </p>

        `;

        return;
    }


    // Afficher chaque favori
    for (
        var i = 0;
        i < favorites.length;
        i++
    ) {

        var product =
            favorites[i];


        var favoriteBox =
            document.createElement("div");


        favoriteBox.classList.add(
            "favorite-product"
        );


        favoriteBox.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.title}"
            >

            <h3>
                ${product.title}
            </h3>

            <span class="favorite-product-price">
                ${product.price}
            </span>

            <i
                class="bx bxs-heart favorite-remove"
                title="Retirer des favoris"
            ></i>

        `;


        (function (favoriteTitle) {

    favoriteBox
        .getElementsByClassName(
            "favorite-remove"
        )[0]
        .addEventListener(
            "click",
            function () {

                removeFavorite(
                    favoriteTitle
                );

            }
        );

})(product.title);

favoritesContent.append(favoriteBox);
    }
}

// ==============================
// Retirer un favori
// ==============================

function removeFavorite(title) {

    favorites =
        favorites.filter(
            function (favorite) {

                return favorite.title !== title;

            }
        );


    // Mettre à jour le cœur
    var products =
        document.getElementsByClassName(
            "product-card"
        );


    for (
        var i = 0;
        i < products.length;
        i++
    ) {

        var productTitle =
            products[i]
                .getElementsByClassName(
                    "product-title"
                )[0]
                .innerText;


        if (productTitle === title) {

            var heart =
                products[i]
                    .getElementsByClassName(
                        "favorite-icon"
                    )[0];


            heart.classList.remove(
                "bxs-heart"
            );

            heart.classList.add(
                "bx-heart"
            );
        }
    }


    saveFavorites();

    displayFavorites();
}