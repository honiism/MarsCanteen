function manageSidebar() {
    const website = document.getElementById("website");
    const sidebar = document.getElementById("sidebar");
    const hamMenu = document.getElementById("ham_menu");

    hamMenu.addEventListener("click", () => {
        const sidebar_con = sidebar.getAttribute("data-con");

        if (sidebar_con == "closed") {
            sidebar.setAttribute("data-con", "open");
            website.style.gridTemplateColumns = "8% 92%";
            sidebar.style.display = "flex"
            return;
        }
        
        if (sidebar_con == "open") {
            sidebar.setAttribute("data-con", "closed");
            website.style.gridTemplateColumns = "100%";
            
            sidebar.style.display = "none";
            sidebar.classList.add("show");
        }
    });
}

manageSidebar();