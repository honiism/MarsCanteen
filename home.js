function manageFilter() {
    const filter = document.getElementById("filter");

    filter.addEventListener("click", () => {
        const filterCon = filter.getAttribute("data-con");

        const all = document.getElementById("all");
        const foods = document.getElementById("foods");
        const snacks = document.getElementById("snacks");
        const drinks = document.getElementById("drinks");

        switch(filterCon) {
            case "all":
                filter.setAttribute("data-con", "foods");
                all.style.display = "none";
                foods.style.display = "block";
                snacks.style.display = "none";
                drinks.style.display = "none";
                
                changeMenu("foods");
                break;

            case "foods":
                filter.setAttribute("data-con", "snacks");
                all.style.display = "none";
                foods.style.display = "none";
                snacks.style.display = "block";
                drinks.style.display = "none";

                changeMenu("snacks");
                break;

            case "snacks":
                filter.setAttribute("data-con", "drinks");
                all.style.display = "none";
                foods.style.display = "none";
                snacks.style.display = "none";
                drinks.style.display = "block";

                changeMenu("drinks");
                break;
                
            case "drinks":
                filter.setAttribute("data-con", "all");
                all.style.display = "block";
                foods.style.display = "none";
                snacks.style.display = "none";
                drinks.style.display = "none";

                changeMenu("all");
                break;
        }
    });
}

function changeMenu(categoryToShow) {
    const menuChild = document.getElementById("menu_grid").children;

    if (categoryToShow == "all") {
        for (let i = 0; i < menuChild.length; i++) {
            menuChild[i].style.display = "flex";
        }
        return;
    }

    for (let i = 0; i < menuChild.length; i++) {
        console.log(menuChild[i].getAttribute("data-category"))
        if (menuChild[i].getAttribute("data-category") == categoryToShow) {
            menuChild[i].style.display = "flex";
        } else {
            menuChild[i].style.display = "none";
        }
    }
}

function manageSidebar() {
    const website = document.getElementById("website");
    const sidebar = document.getElementById("sidebar");
    const hamMenu = document.getElementById("ham_menu");

    hamMenu.addEventListener("click", () => {
        const sidebar_con = sidebar.getAttribute("data-con");

        if (sidebar_con == "closed") {
            sidebar.setAttribute("data-con", "open");
            website.style.gridTemplateColumns = "8% 72% 20%";
            sidebar.style.display = "flex"
            return;
        }
        
        if (sidebar_con == "open") {
            sidebar.setAttribute("data-con", "closed");
            website.style.gridTemplateColumns = "80% 20%";
            
            sidebar.style.display = "none";
            sidebar.classList.add("show");
        }
    });
}

let menu = [];

async function getMenu(callbackFav, callbackCart) {
    try {
      const response = await fetch("menu.json");
      const data = await response.json();
      menu = data;
      
      addMenu(callbackFav, callbackCart);

    } catch (error) {
      console.error("Error fetching menu:", error);
    }
}

function addMenu(callbackFav, callbackCart) {
    const menuGrid = document.getElementById("menu_grid");

    if (menu.length > 0) {
        menu.forEach(menuItem => {
            const newMenuItem = document.createElement("div");

            newMenuItem.dataset.id = menuItem.id;
            newMenuItem.classList.add("product");
            newMenuItem.setAttribute("data-category", menuItem.category);
            newMenuItem.setAttribute("data-menu-id", menuItem.name)

            newMenuItem.innerHTML =
                `<img src="${menuItem.image}" alt="" class="product_img">
                <p class="product_title">${menuItem.name}</p>
                <p class="product_price">Rp${menuItem.price}</p>
                <div class="product_rating">
                    <img src="assets/images/star.svg" alt="" class="rating_img">
                    <p class="rating_value">${menuItem.rating}</p>
                    <img src="assets/images/heart_side.svg" class="fav_img">
                </div>
                <div class="cart_button">Beli</div>
            `;
        
            menuGrid.appendChild(newMenuItem);
        });

        callbackFav(); // add event listener to all fav buttons after menu is added
        callbackCart(); // add event listener to cart buttons
    }
}

function handleFavMenu() {
    const favButtons = document.getElementsByClassName("fav_img");
    const favMenuGrid = document.getElementById("fav_menu_grid");
    const noFav = document.getElementById("no_fav");

    for (let i = 0; i < favButtons.length; i++) {
        favButtons[i].addEventListener("click", (event) => {
            const parentProduct = event.target.parentElement.parentElement; // targets #product element
            
            const newParentProduct = parentProduct.cloneNode(true);
            const newParentProductId = newParentProduct.getAttribute("data-menu-id");
            
            const productExists = Array.from(favMenuGrid.children).find(child => {
                return child.getAttribute("data-menu-id") == newParentProductId
            });

            if (productExists) {
                newParentProduct.remove();
                return;
            }

            const newFavButton = newParentProduct.querySelector(".fav_img");

            newFavButton.src = "assets/images/heart.png";

            favMenuGrid.style.display = "grid";
            favMenuGrid.style.widows = "100%";
            favMenuGrid.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
            favMenuGrid.style.gap = "40px 10px";

            if (noFav.style.display != "none") {
                noFav.style.display = "none";
            }

            favMenuGrid.appendChild(newParentProduct);

            // handle remove fav item
            newFavButton.addEventListener("click", () => {
                const favMenuGridItems = favMenuGrid.children;

                newParentProduct.remove();

                if (favMenuGridItems.length == 0) {
                    noFav.style.display = "flex";
                }
            });
        });
    }
}

function manageCart() {
    const cart = document.getElementById("cart");
    const cartButtons = Array.from(document.getElementsByClassName("cart_button"));

    cartButtons.forEach(cartButton => {
        cartButton.addEventListener("click", () => {
            const parentMenu = cartButton.parentElement;
            const newCartItem = document.createElement("div");
            
            const orderName = parentMenu.getElementsByClassName("product_title")[0].innerHTML;
            const orderImg = parentMenu.getElementsByClassName("product_img")[0].src;
            const ogOrderPrice = parentMenu.getElementsByClassName("product_price")[0].innerHTML;

            let orderAmt = 1;

            const productExists = Array.from(cart.children).find(child => {
                return child.getAttribute("data-menu-id") == orderName
            });

            if (productExists) {
                newCartItem.remove();
                return;
            }

            newCartItem.innerHTML =
                `<img src="${orderImg}" class="order_icon">
                <div class="order_details">
                    <p class="order_title">${orderName}</p>
                    <div class="amount">
                        <img src="assets/images/plus.svg" alt="" class="plus_button">
                        <p class="items_amount">${orderAmt}</p>
                        <img src="assets/images/minus.svg" alt="" class="minus_button">
                    </div>
                    <p class="order_price">${ogOrderPrice}</p>
                </div>`;

            cart.appendChild(newCartItem);

            const menuOrderAmount = newCartItem.getElementsByClassName("items_amount")[0];
            const menuOrderPrice = newCartItem.getElementsByClassName("order_price")[0];
            const add = newCartItem.getElementsByClassName("plus_button")[0];
            const min = newCartItem.getElementsByClassName("minus_button")[0];

            let orderPrice = parseInt(ogOrderPrice.replace("Rp", "").replace(".", ""));

            newCartItem.classList.add("order");
            newCartItem.setAttribute("data-menu-id", orderName);

            add.addEventListener("click", () => {
                orderAmt++;
                menuOrderAmount.innerHTML = orderAmt;
        
                orderPrice = orderPrice * orderAmt;
                menuOrderPrice.innerHTML = `Rp${orderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
            });
        
            min.addEventListener("click", () => {
                orderAmt--;
                
                if (orderAmt == 0) {
                    newCartItem.remove();
                    return;
                }
        
                menuOrderAmount.innerHTML = orderAmt;
        
                orderPrice = orderPrice / orderAmt;
                menuOrderPrice.innerHTML = `Rp${orderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
            });
        });
    });
}

getMenu(handleFavMenu, manageCart);
manageFilter();
manageSidebar();