/* =====================================================
   DAPUR IBU YENI - JAVASCRIPT
   Data menu terpusat + pemesanan WhatsApp + navigasi
==================================================== */

"use strict";

(function () {
    /* ================= KONFIGURASI & DATA ================= */
    const WHATSAPP_NUMBER = "6281284374705";
    const MAX_QTY = 99;
    const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID");
    const MENU_IMAGE_SIZES = "(max-width: 1024px) 45vw, 30vw";

    // Satu sumber data untuk kartu menu, daftar harga, ringkasan, dan pesan WhatsApp.
    const PRODUCTS = [
        {
            key: "ayam",
            name: "Ayam Goreng Serundeng",
            price: 17000,
            description: "Ayam gurih renyah dengan baluran serundeng kelapa kaya rempah khas rumahan.",
            image: "assets/optimized/menu-ayam.jpg",
            alt: "Ayam Goreng Serundeng",
            width: 800,
            height: 791
        },
        {
            key: "nasgor",
            name: "Nasi Goreng",
            price: 15000,
            description: "Nasi goreng harum berani bumbu dengan rasa gurih pas dan pelengkap mantap.",
            image: "assets/optimized/menu-nasi-goreng.jpg",
            alt: "Nasi Goreng",
            width: 600,
            height: 800
        },
        {
            key: "mierebus",
            name: "Mie Rebus Kuah",
            price: 15000,
            description: "Mie kuah hangat dengan kaldu gurih segar, pas disantap kapan saja.",
            image: "assets/optimized/menu-mie-rebus.jpg",
            alt: "Mie Rebus Kuah",
            width: 600,
            height: 800
        },
        {
            key: "tongseng",
            name: "Tongseng",
            price: 20000,
            description: "Tongseng dengan kuah santan bumbu kaya rempah yang meresap sempurna.",
            image: "assets/optimized/menu-tongseng.jpg",
            alt: "Tongseng",
            width: 600,
            height: 800
        },
        {
            key: "mie-goreng",
            name: "Mie Goreng",
            price: 15000,
            description: "Mie goreng lezat dengan bumbu pilihan yang gurih dan nikmat.",
            image: "assets/optimized/menu-mie-goreng.jpg",
            alt: "Mie Goreng",
            width: 600,
            height: 800
        }
    ];

    const productMap = new Map(PRODUCTS.map(function (product) {
        return [product.key, product];
    }));

    const cart = new Map(PRODUCTS.map(function (product) {
        return [product.key, 0];
    }));

    let lastFocusedElement = null;
    let isSubmitting = false;

    /* ================= UTILITAS ================= */
    function getElement(id) {
        return document.getElementById(id);
    }

    function formatRupiah(value) {
        return "Rp " + CURRENCY_FORMATTER.format(value);
    }

    function getCartItems() {
        return PRODUCTS.filter(function (product) {
            return (cart.get(product.key) || 0) > 0;
        }).map(function (product) {
            const qty = cart.get(product.key) || 0;
            return {
                product: product,
                qty: qty,
                subtotal: qty * product.price
            };
        });
    }

    function getCartTotals() {
        return getCartItems().reduce(function (totals, item) {
            totals.count += item.qty;
            totals.total += item.subtotal;
            return totals;
        }, { count: 0, total: 0 });
    }

    /* ================= RENDER KATALOG & HARGA ================= */
    function renderMenu() {
        const menuGrid = getElement("menuGrid");
        if (!menuGrid) {
            return;
        }

        menuGrid.textContent = "";

        PRODUCTS.forEach(function (product) {
            const article = document.createElement("article");
            article.className = "menu-card";

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "menu-image";

            const image = document.createElement("img");
            image.src = product.image;
            image.srcset = product.image.replace(/\.jpg$/, "-400.jpg") + " 400w, " + product.image + " " + product.width + "w";
            image.sizes = MENU_IMAGE_SIZES;
            image.alt = product.alt;
            image.width = product.width;
            image.height = product.height;
            image.loading = "lazy";
            image.decoding = "async";
            imageWrapper.appendChild(image);

            const info = document.createElement("div");
            info.className = "menu-info";

            const title = document.createElement("h3");
            title.textContent = product.name;

            const description = document.createElement("p");
            description.textContent = product.description;

            const bottom = document.createElement("div");
            bottom.className = "menu-bottom";

            const price = document.createElement("strong");
            price.className = "price";
            price.textContent = formatRupiah(product.price);

            const qtyControl = document.createElement("div");
            qtyControl.className = "qty-control";
            qtyControl.setAttribute("role", "group");
            qtyControl.setAttribute("aria-label", "Jumlah " + product.name);

            const minusButton = document.createElement("button");
            minusButton.type = "button";
            minusButton.className = "btn-qty";
            minusButton.dataset.qtyKey = product.key;
            minusButton.dataset.qtyChange = "-1";
            minusButton.setAttribute("aria-label", "Kurangi " + product.name);
            minusButton.textContent = "-";

            const qtyCount = document.createElement("span");
            qtyCount.className = "qty-count";
            qtyCount.id = "qty-" + product.key;
            qtyCount.setAttribute("aria-live", "polite");
            qtyCount.textContent = "0";

            const plusButton = document.createElement("button");
            plusButton.type = "button";
            plusButton.className = "btn-qty";
            plusButton.dataset.qtyKey = product.key;
            plusButton.dataset.qtyChange = "1";
            plusButton.setAttribute("aria-label", "Tambah " + product.name);
            plusButton.textContent = "+";

            qtyControl.appendChild(minusButton);
            qtyControl.appendChild(qtyCount);
            qtyControl.appendChild(plusButton);

            bottom.appendChild(price);
            bottom.appendChild(qtyControl);
            info.appendChild(title);
            info.appendChild(description);
            info.appendChild(bottom);
            article.appendChild(imageWrapper);
            article.appendChild(info);
            menuGrid.appendChild(article);
        });
    }

    function renderPriceList() {
        const priceTable = getElement("priceTable");
        if (!priceTable) {
            return;
        }

        PRODUCTS.forEach(function (product) {
            const row = document.createElement("div");
            row.className = "price-row";

            const name = document.createElement("span");
            name.textContent = product.name;

            const price = document.createElement("strong");
            price.textContent = formatRupiah(product.price);

            row.appendChild(name);
            row.appendChild(price);
            priceTable.appendChild(row);
        });
    }

    /* ================= KERANJANG & RINGKASAN ================= */
    function updateQty(key, change) {
        if (!productMap.has(key)) {
            return;
        }

        const current = cart.get(key) || 0;
        const next = Math.min(MAX_QTY, Math.max(0, current + change));
        cart.set(key, next);

        const qtyElement = getElement("qty-" + key);
        if (qtyElement) {
            qtyElement.textContent = String(next);
        }

        updateOrderSummary();
    }

    function updateOrderSummary() {
        const totals = getCartTotals();
        const countElement = getElement("floatingCount");
        const totalElement = getElement("floatingTotal");

        if (countElement) {
            countElement.textContent = totals.count + " Item Dipilih";
        }

        if (totalElement) {
            totalElement.textContent = formatRupiah(totals.total);
        }

        const modal = getElement("orderModal");
        if (modal && modal.classList.contains("active")) {
            renderModalSummary();
        }
    }

    function renderModalSummary() {
        const summaryList = getElement("modalSummaryList");
        const totalPriceElement = getElement("modalTotalPrice");
        if (!summaryList || !totalPriceElement) {
            return;
        }

        summaryList.textContent = "";
        const items = getCartItems();
        let total = 0;

        if (items.length === 0) {
            const emptyItem = document.createElement("li");
            emptyItem.className = "empty-msg";
            emptyItem.textContent = "Belum ada menu yang dipilih";
            summaryList.appendChild(emptyItem);
        } else {
            items.forEach(function (item) {
                total += item.subtotal;

                const listItem = document.createElement("li");
                const label = document.createElement("span");
                label.textContent = item.product.name + " (" + item.qty + "x)";

                const subtotal = document.createElement("strong");
                subtotal.textContent = formatRupiah(item.subtotal);

                listItem.appendChild(label);
                listItem.appendChild(subtotal);
                summaryList.appendChild(listItem);
            });
        }

        totalPriceElement.textContent = formatRupiah(total);
    }

    /* ================= MODAL PEMESANAN ================= */
    function openOrderModal() {
        const modal = getElement("orderModal");
        const totals = getCartTotals();

        if (totals.count === 0) {
            window.alert("Silakan pilih minimal 1 menu makanan terlebih dahulu.");
            return;
        }

        if (!modal) {
            return;
        }

        lastFocusedElement = document.activeElement;
        renderModalSummary();
        hideFormError();

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const closeButton = getElement("closeOrderBtn");
        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeOrderModal(options) {
        const modal = getElement("orderModal");
        if (!modal || !modal.classList.contains("active")) {
            return;
        }

        const shouldRestoreFocus = !options || options.restoreFocus !== false;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        hideFormError();

        if (shouldRestoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }

        lastFocusedElement = null;
    }

    function showFormError(message, fallbackUrl) {
        const errorElement = getElement("orderFormError");
        if (!errorElement) {
            window.alert(message);
            return;
        }

        errorElement.textContent = message;

        if (fallbackUrl) {
            errorElement.appendChild(document.createTextNode(" "));

            const link = document.createElement("a");
            link.href = fallbackUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Buka WhatsApp secara manual";

            errorElement.appendChild(link);
        }

        errorElement.hidden = false;
    }

    function hideFormError() {
        const errorElement = getElement("orderFormError");
        if (!errorElement) {
            return;
        }

        errorElement.hidden = true;
        errorElement.textContent = "";
    }

    function buildOrderMessage(name, address, payment) {
        const items = getCartItems();
        const totals = getCartTotals();
        const lines = [
            "Halo Dapur Ibu Yeni, saya ingin memesan makanan:",
            "",
            "*DATA PEMESAN*",
            "Nama: " + name,
            "Alamat/Catatan: " + address,
            "Metode Bayar: " + payment,
            "",
            "*RINGKASAN PESANAN*"
        ];

        items.forEach(function (item) {
            lines.push("- " + item.product.name + " x" + item.qty + " = " + formatRupiah(item.subtotal));
        });

        lines.push(
            "",
            "*TOTAL PEMBAYARAN: " + formatRupiah(totals.total) + "*",
            "",
            "Mohon konfirmasi pesanan saya. Terima kasih!"
        );

        return lines.join("\n");
    }

    function handleOrderSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        hideFormError();

        const form = event.currentTarget;
        const nameInput = getElement("custName");
        const addressInput = getElement("custAddress");
        const paymentInput = getElement("custPayment");
        const submitButton = getElement("orderSubmitBtn");

        if (!nameInput || !addressInput || !paymentInput || !submitButton) {
            return;
        }

        const name = nameInput.value.trim();
        const address = addressInput.value.trim();
        const payment = paymentInput.value;
        const totals = getCartTotals();

        if (totals.count === 0) {
            showFormError("Silakan pilih minimal 1 menu makanan terlebih dahulu.");
            return;
        }

        if (!name) {
            showFormError("Nama pemesan wajib diisi.");
            nameInput.focus();
            return;
        }

        if (!address) {
            showFormError("Alamat pengiriman atau catatan wajib diisi.");
            addressInput.focus();
            return;
        }

        const message = buildOrderMessage(name, address, payment);
        const whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
        const defaultButtonLabel = submitButton.textContent;

        isSubmitting = true;
        submitButton.disabled = true;
        submitButton.textContent = "Membuka WhatsApp...";

        try {
            const whatsappWindow = window.open(whatsappUrl, "_blank");

            if (!whatsappWindow) {
                showFormError(
                    "Popup WhatsApp diblokir oleh browser. Izinkan popup untuk situs ini, atau gunakan tautan berikut:",
                    whatsappUrl
                );
                return;
            }

            form.reset();
            closeOrderModal({ restoreFocus: false });

            const openButton = getElement("openOrderBtn");
            if (openButton) {
                openButton.focus();
            }
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = defaultButtonLabel;
        }
    }

    function trapModalFocus(event) {
        if (event.key !== "Tab") {
            return;
        }

        const modal = getElement("orderModal");
        if (!modal || !modal.classList.contains("active")) {
            return;
        }

        const focusable = modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ================= NAVIGASI ================= */
    function closeMobileMenu() {
        const navMenu = getElement("navMenu");
        const menuToggle = getElement("menuToggle");
        if (!navMenu || !menuToggle) {
            return;
        }

        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    }

    function bindNavigation() {
        const menuToggle = getElement("menuToggle");
        const navMenu = getElement("navMenu");

        if (menuToggle && navMenu) {
            menuToggle.addEventListener("click", function () {
                const isOpen = navMenu.classList.toggle("active");
                menuToggle.setAttribute("aria-expanded", String(isOpen));
                menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
            });

            navMenu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", closeMobileMenu);
            });
        }

        const dropdowns = document.querySelectorAll("#navMenu .nav-dropdown");

        dropdowns.forEach(function (dropdown) {
            dropdown.addEventListener("toggle", function () {
                if (dropdown.open) {
                    dropdowns.forEach(function (other) {
                        if (other !== dropdown) {
                            other.open = false;
                        }
                    });
                }
            });
        });

        document.querySelectorAll("#navMenu .dropdown-menu a").forEach(function (link) {
            link.addEventListener("click", function () {
                dropdowns.forEach(function (dropdown) {
                    dropdown.open = false;
                });
                closeMobileMenu();
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
                closeMobileMenu();
                if (menuToggle) {
                    menuToggle.focus();
                }
            }
        });

        const desktopQuery = window.matchMedia("(min-width: 769px)");
        const handleViewportChange = function (event) {
            if (event.matches) {
                closeMobileMenu();
            }
        };

        if (typeof desktopQuery.addEventListener === "function") {
            desktopQuery.addEventListener("change", handleViewportChange);
        } else if (typeof desktopQuery.addListener === "function") {
            desktopQuery.addListener(handleViewportChange);
        }
    }

    /* ================= EFEK & UTILITAS HALAMAN ================= */
    function bindBackToTop() {
        const backToTop = getElement("backToTop");
        if (!backToTop) {
            return;
        }

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    function bindScrollEffects() {
        const backToTop = getElement("backToTop");
        const navbar = document.querySelector(".navbar");

        window.addEventListener("scroll", function () {
            if (backToTop) {
                backToTop.classList.toggle("show", window.scrollY > 400);
            }

            if (navbar) {
                navbar.style.boxShadow = window.scrollY > 30
                    ? "0 4px 20px rgba(66, 36, 20, 0.1)"
                    : "none";
            }
        }, { passive: true });
    }

    function bindRevealAnimation() {
        const animatedElements = document.querySelectorAll(
            ".menu-card, .swot-card, .sop-card, .vm-card, .documentation-card, .media-card"
        );

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            return;
        }

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
            { threshold: 0.1 }
        );

        animatedElements.forEach(function (element) {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            observer.observe(element);
        });
    }

    function setCopyrightYear() {
        const yearElement = getElement("year");
        if (yearElement) {
            yearElement.textContent = String(new Date().getFullYear());
        }
    }

    /* ================= INISIALISASI ================= */
    function init() {
        renderMenu();
        renderPriceList();
        updateOrderSummary();

        bindNavigation();
        bindBackToTop();
        bindScrollEffects();
        bindRevealAnimation();
        setCopyrightYear();

        const menuGrid = getElement("menuGrid");
        if (menuGrid) {
            menuGrid.addEventListener("click", function (event) {
                const button = event.target.closest("button[data-qty-key]");
                if (!button) {
                    return;
                }

                updateQty(button.dataset.qtyKey, Number(button.dataset.qtyChange));
            });
        }

        const openButton = getElement("openOrderBtn");
        if (openButton) {
            openButton.addEventListener("click", openOrderModal);
        }

        const closeButton = getElement("closeOrderBtn");
        if (closeButton) {
            closeButton.addEventListener("click", function () {
                closeOrderModal();
            });
        }

        const cancelButton = getElement("cancelOrderBtn");
        if (cancelButton) {
            cancelButton.addEventListener("click", function () {
                closeOrderModal();
            });
        }

        const modal = getElement("orderModal");
        if (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    closeOrderModal();
                }
            });
            modal.addEventListener("keydown", trapModalFocus);
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal && modal.classList.contains("active")) {
                closeOrderModal();
            }
        });

        const orderForm = getElement("orderForm");
        if (orderForm) {
            orderForm.addEventListener("submit", handleOrderSubmit);
        }

        ["custName", "custAddress", "custPayment"].forEach(function (id) {
            const field = getElement(id);
            if (field) {
                field.addEventListener("input", hideFormError);
                field.addEventListener("change", hideFormError);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
