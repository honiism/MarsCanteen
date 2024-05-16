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
        if (menuChild[i].getAttribute("data-category") !== categoryToShow) {
            menuChild[i].style.display = "none";
        } else {
            menuChild[i].style.display = "flex";
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
            sidebar.style.display = "flex";
            return;
        }
        
        if (sidebar_con == "open") {
            sidebar.setAttribute("data-con", "closed");
            website.style.gridTemplateColumns = "80% 20%";
            sidebar.style.display = "none";
        }
    });
}

let menu = [];

async function getMenu() {
    try {
      const response = await fetch("menu.json");
      const data = await response.json();
      menu = data;
      addMenu();
      
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
}

function addMenu() {
    const menuGrid = document.getElementById("menu_grid");

    if (menu.length > 0) {
        menu.forEach(menuItem => {
            let newMenuItem = document.createElement("div");

            newMenuItem.dataset.id = menuItem.id;
            newMenuItem.classList.add("product");
            newMenuItem.setAttribute("data-category", menuItem.category)

            newMenuItem.innerHTML =
                `<img src="${menuItem.image}" alt="" class="product_img">
                <p class="product_title">${menuItem.name}</p>
                <p class="product_price">Rp${menuItem.price}</p>
                <div class="product_rating">
                    <img src="assets/images/star.svg" alt="" class="rating_img">
                    <p class="rating_value">${menuItem.rating}</p>
                </div>
                <div class="cart_button">Beli</div>
            `;
            
            menuGrid.appendChild(newMenuItem);
        });
    }
}

getMenu();
manageFilter();
manageSidebar();