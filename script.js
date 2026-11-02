/* =====================================================
   DAPUR IBU YENI - JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    /* ================= MOBILE MENU TOGGLE ================= */
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

        // Otomatis menutup navbar mobile saat link diklik
        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
            });
        });
    }

    /* ================= BACK TO TOP BUTTON ================= */
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ================= AUTO COPYRIGHT YEAR ================= */
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ================= NAVBAR SHADOW ON SCROLL ================= */
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 30) {
                navbar.style.boxShadow = "0 4px 20px rgba(66, 36, 20, 0.1)";
            } else {
                navbar.style.boxShadow = "none";
            }
        });
    }

    /* ================= SCROLL FADE-IN ANIMATION ================= */
    const animatedElements = document.querySelectorAll(
        ".menu-card, .swot-card, .sop-card, .review-card, .vm-card, .delivery-card, .documentation-card, .media-card"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        animatedElements.forEach(function (element) {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            observer.observe(element);
        });
    }
});

/* ================= ORDER & MODAL LOGIC ================= */
const products = {
    ayam: { name: "Ayam Goreng Serundeng", price: 17000, qty: 0 },
    nasgor: { name: "Nasi Goreng Spesial", price: 15000, qty: 0 },
    mierebus: { name: "Mie Rebus Kuah Warm", price: 15000, qty: 0 },
    tongseng: { name: "Tongseng Gurih", price: 20000, qty: 0 },
    "mie-goreng": { name: "Mie Goreng",price: 15000,qty: 0 }
};

function updateQty(key, change) {
    if (products[key]) {
        products[key].qty += change;
        if (products[key].qty < 0) products[key].qty = 0;

        document.getElementById(`qty-${key}`).textContent = products[key].qty;
        updateFloatingBar();
    }
}

function updateFloatingBar() {
    let total = 0;
    let count = 0;

    for (const key in products) {
        if (products[key].qty > 0) {
            count += products[key].qty;
            total += products[key].qty * products[key].price;
        }
    }

    document.getElementById("floatingCount").textContent = `${count} Item Dipilih`;
    document.getElementById("floatingTotal").textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function openOrderModal() {
    let count = 0;
    for (const key in products) {
        count += products[key].qty;
    }

    if (count === 0) {
        alert("Silakan pilih minimal 1 menu makanan terlebih dahulu.");
        return;
    }

    renderModalSummary();
    document.getElementById("orderModal").classList.add("active");
}

function closeOrderModal() {
    document.getElementById("orderModal").classList.remove("active");
}

function renderModalSummary() {
    const summaryList = document.getElementById("modalSummaryList");
    const totalPriceEl = document.getElementById("modalTotalPrice");

    summaryList.innerHTML = "";
    let total = 0;

    for (const key in products) {
        const item = products[key];
        if (item.qty > 0) {
            const subtotal = item.qty * item.price;
            total += subtotal;

            const li = document.createElement("li");
            li.innerHTML = `<span>${item.name} (${item.qty}x)</span> <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong>`;
            summaryList.appendChild(li);
        }
    }

    totalPriceEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function sendOrderToWA(event) {
    event.preventDefault();

    let orderItemsText = "";
    let total = 0;

    for (const key in products) {
        const item = products[key];
        if (item.qty > 0) {
            const subtotal = item.qty * item.price;
            total += subtotal;
            orderItemsText += `• ${item.name} x${item.qty} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
        }
    }

    const name = document.getElementById("custName").value;
    const address = document.getElementById("custAddress").value;
    const payment = document.getElementById("custPayment").value;

    const waText = `Halo Dapur Ibu Yeni, saya ingin memesan makanan:\n\n` +
                   `*DATA PEMESAN*\n` +
                   `Nama: ${name}\n` +
                   `Alamat/Catatan: ${address}\n` +
                   `Metode Bayar: ${payment}\n\n` +
                   `*RINGKASAN PESANAN*\n` +
                   `${orderItemsText}\n` +
                   `*TOTAL PEMBAYARAN: Rp ${total.toLocaleString('id-ID')}*\n\n` +
                   `Mohon konfirmasi pesanan saya. Terima kasih!`;

    const encodedText = encodeURIComponent(waText);
    window.open(`https://wa.me/6281284374705?text=${encodedText}`, '_blank');
}

// Dropdown navbar: hanya satu yang terbuka
const dropdowns = document.querySelectorAll(
    "#navMenu .nav-dropdown"
);

dropdowns.forEach(dropdown => {
    dropdown.addEventListener("toggle", () => {
        if (dropdown.open) {
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.open = false;
                }
            });
        }
    });
});

// Tutup dropdown setelah submenu dipilih
document.querySelectorAll("#navMenu .dropdown-menu a")
    .forEach(link => {
        link.addEventListener("click", () => {
            dropdowns.forEach(dropdown => {
                dropdown.open = false;
            });

            document.getElementById("navMenu")
                .classList.remove("active");
        });
    });
