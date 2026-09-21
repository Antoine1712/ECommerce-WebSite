// ==============================
// Éléments du panier
// ==============================

let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let cartCount = document.querySelector('.cart-count');
let emptyCartMessage = document.querySelector('.empty-cart-message');


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


    // Bouton acheter
    document.getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);


    // Code promo
    document.getElementById("promo-button")
        .addEventListener("click", applyPromo);


    updateCart();
}


// ==============================
// Ajouter un produit
// ==============================

function addCartClicked(event) {

    var button = event.target;
    var shopProducts = button.parentElement;

    var title = shopProducts
        .getElementsByClassName("product-title")[0]
        .innerText;

    var price = shopProducts
        .getElementsByClassName("price")[0]
        .innerText;

    var productImg = shopProducts
        .getElementsByClassName("product-img")[0]
        .src;

    addProductToCart(title, price, productImg);

    updateCart();
}


// ==============================
// Ajouter au panier
// ==============================

function addProductToCart(title, price, productImg) {

    var cartItems = document.getElementsByClassName("cart-content")[0];

    var cartItemsNames =
        cartItems.getElementsByClassName("cart-product-title");


    // Vérifier si le produit existe déjà
    for (var i = 0; i < cartItemsNames.length; i++) {

       if (cartItemsNames[i].innerText == title) {

    var cartBox = cartItemsNames[i].closest(".cart-box");

    var quantityInput =
        cartBox.getElementsByClassName("cart-quantity")[0];

    quantityInput.value =
        parseInt(quantityInput.value) + 1;

    updateCart();

    return;
    }
}


    // Créer le produit dans le panier
    var cartShopBox = document.createElement("div");

    cartShopBox.classList.add("cart-box");


    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">

        <div class="detail-box">

            <div class="cart-product-title">
                ${title}
            </div>

            <div class="cart-price">
                Prix unitaire : ${price}
            </div>

            <div class="quantity-box">

                <button type="button" class="quantity-btn quantity-minus">
                    −
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                    class="cart-quantity"
                    readonly
                >

                <button type="button" class="quantity-btn quantity-plus">
                    +
                </button>

            </div>

            <div class="cart-subtotal">
                Sous-total : ${price}
            </div>

        </div>

        <i class='bx bxs-trash-alt cart-remove'></i>
    `;


    cartShopBox.innerHTML = cartBoxContent;

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
// Augmenter quantité
// ==============================

function increaseQuantity(event) {

    var button = event.target;

    var cartBox = button.closest(".cart-box");

    var input =
        cartBox.getElementsByClassName("cart-quantity")[0];

    input.value = parseInt(input.value) + 1;

    updateCart();
}


// ==============================
// Diminuer quantité
// ==============================

function decreaseQuantity(event) {

    var button = event.target;

    var cartBox = button.closest(".cart-box");

    var input =
        cartBox.getElementsByClassName("cart-quantity")[0];


    if (parseInt(input.value) > 1) {

        input.value = parseInt(input.value) - 1;

    } else {

        cartBox.remove();

    }

    updateCart();
}


// ==============================
// Supprimer un produit
// ==============================

function removeCartItem(event) {

    var buttonClicked = event.target;

    buttonClicked.closest(".cart-box").remove();

    updateCart();
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
        promoInput.value.trim().toUpperCase();


    if (code === "PROMO10") {

        promoApplied = true;

        promoMessage.innerText =
            "Code promo appliqué : -10 %";

        updateCart();

    } else {

        promoApplied = false;

        promoMessage.innerText =
            "Code promo invalide.";

        updateCart();
    }
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

        var cartBox = cartBoxes[i];

        var priceElement =
            cartBox.getElementsByClassName("cart-price")[0];

        var quantityElement =
            cartBox.getElementsByClassName("cart-quantity")[0];

        var subtotalElement =
            cartBox.getElementsByClassName("cart-subtotal")[0];


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
            productSubtotal.toFixed(2)
                .replace(".", ",") +
            " €";
    }


    // Réduction
    var discount = 0;

    if (promoApplied) {

        discount = subtotal * 0.10;

    }


    // Livraison
    var shipping = 0;

    if (cartBoxes.length > 0) {

        shipping = 4.99;

    }


    // Total
    var total =
        subtotal + shipping - discount;


    // Afficher le sous-total
    document.getElementsByClassName("subtotal-price")[0]
        .innerText =
        subtotal.toFixed(2)
            .replace(".", ",") +
        " €";


    // Afficher livraison
    document.getElementsByClassName("shipping-price")[0]
        .innerText =
        shipping.toFixed(2)
            .replace(".", ",") +
        " €";


    // Afficher réduction
    document.getElementsByClassName("discount-price")[0]
        .innerText =
        "-" +
        discount.toFixed(2)
            .replace(".", ",") +
        " €";


    // Afficher total
    document.getElementsByClassName("total-price")[0]
        .innerText =
        total.toFixed(2)
            .replace(".", ",") +
        " €";


    // Badge panier
    cartCount.innerText = itemCount;


    // Afficher/cacher le message panier vide
    if (cartBoxes.length === 0) {

        emptyCartMessage.style.display = "block";

    } else {

        emptyCartMessage.style.display = "none";

    }


    // Cacher le badge si panier vide
    if (itemCount === 0) {

        cartCount.style.display = "none";

    } else {

        cartCount.style.display = "flex";

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

    document.getElementById("promo-code").value = "";

    document.getElementById("promo-message").innerText = "";


    updateCart();
}