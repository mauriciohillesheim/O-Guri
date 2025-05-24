// Variáveis globais
let cart = [];
let products = [];
let users = [];
let orders = [];
let currentUser = null;
let serviceFee = 0;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Esconder o loader após o carregamento
    setTimeout(() => {
        document.querySelector('.loader-container').classList.add('hidden');
    }, 1500);

    // Carregar dados do LocalStorage
    loadDataFromLocalStorage();

    // Inicializar produtos de exemplo se não existirem
    if (products.length === 0) {
        initSampleProducts();
    }

    // Renderizar produtos
    renderProducts();

    // Inicializar eventos
    initEvents();

    // Verificar se há um usuário logado
    checkLoggedInUser();
}

// Carregar dados do LocalStorage
function loadDataFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    const storedUsers = localStorage.getItem('users');
    const storedOrders = localStorage.getItem('orders');
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
    
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
    
    // Carregar carrinho do usuário atual
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
    }
}

// Salvar dados no LocalStorage
function saveDataToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Inicializar produtos de exemplo
function initSampleProducts() {
    products = [
        {
            id: '1',
            name: 'Maçã Fuji',
            description: 'Maçãs frescas e suculentas.',
            price: 8.90,
            imageUrl: 'images/product-placeholder.svg',
            category: 'fruits',
            stock: 50,
            badge: 'Popular'
        },
        {
            id: '2',
            name: 'Tomate Italiano',
            description: 'Tomates frescos para sua salada.',
            price: 6.50,
            imageUrl: 'images/product-placeholder.svg',
            category: 'vegetables',
            stock: 40
        },
        {
            id: '3',
            name: 'Filé de Frango',
            description: 'Filé de frango fresco e sem pele.',
            price: 18.90,
            imageUrl: 'images/product-placeholder.svg',
            category: 'meat',
            stock: 30,
            badge: 'Oferta'
        },
        {
            id: '4',
            name: 'Queijo Mussarela',
            description: 'Queijo mussarela fatiado.',
            price: 12.50,
            imageUrl: 'images/product-placeholder.svg',
            category: 'dairy',
            stock: 25
        },
        {
            id: '5',
            name: 'Pão Francês',
            description: 'Pão francês fresco do dia.',
            price: 0.75,
            imageUrl: 'images/product-placeholder.svg',
            category: 'bakery',
            stock: 100
        },
        {
            id: '6',
            name: 'Banana Prata',
            description: 'Bananas frescas e maduras.',
            price: 5.90,
            imageUrl: 'images/product-placeholder.svg',
            category: 'fruits',
            stock: 60
        }
    ];
    
    saveDataToLocalStorage();
}

// Renderizar produtos na página
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<div class="product-badge">${product.badge}</div>`;
        }
        
        productCard.innerHTML = `
            ${badgeHtml}
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="product-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="btn btn-primary btn-add-to-cart">Adicionar</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Adicionar eventos aos botões de quantidade e adicionar ao carrinho
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            value = Math.max(1, value - 1);
            input.value = value;
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            value += 1;
            input.value = value;
        });
    });
    
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const quantity = parseInt(productCard.querySelector('.quantity-input').value);
            addToCart(productId, quantity);
        });
    });
}

// Inicializar eventos
function initEvents() {
    // Navegação
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateTo(section);
        });
    });

    // Menu mobile
    document.getElementById('btn-menu').addEventListener('click', toggleMobileMenu);
    document.getElementById('btn-close-menu').addEventListener('click', toggleMobileMenu);

    // Carrinho
    document.getElementById('btn-cart').addEventListener('click', toggleCart);
    document.getElementById('btn-close-cart').addEventListener('click', toggleCart);
    document.getElementById('btn-start-shopping').addEventListener('click', () => {
        toggleCart();
        navigateTo('products');
    });
    document.getElementById('btn-checkout').addEventListener('click', openCheckoutModal);

    // Autenticação
    document.getElementById('btn-user').addEventListener('click', openUserModal);
    document.getElementById('btn-close-user-modal').addEventListener('click', closeUserModal);
    document.getElementById('switch-to-register').addEventListener('click', switchToRegister);
    document.getElementById('switch-to-login').addEventListener('click', switchToLogin);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('btn-view-orders').addEventListener('click', openMyOrdersModal);

    // Checkout
    document.getElementById('btn-close-checkout-modal').addEventListener('click', closeCheckoutModal);
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextSection = this.dataset.next;
            showCheckoutSection(nextSection);
        });
    });
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', function() {
            const prevSection = this.dataset.back;
            showCheckoutSection(prevSection);
        });
    });
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

    // Métodos de pagamento
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
        input.addEventListener('change', togglePaymentForm);
    });

    // Confirmação de pedido
    document.getElementById('btn-close-confirmation-modal').addEventListener('click', closeConfirmationModal);
    document.getElementById('btn-continue-shopping').addEventListener('click', () => {
        closeConfirmationModal();
        navigateTo('products');
    });

    // Meus Pedidos
    document.getElementById('btn-close-my-orders').addEventListener('click', closeMyOrdersModal);

    // Botões CTA
    document.getElementById('btn-hero-shop').addEventListener('click', () => navigateTo('products'));
    document.getElementById('btn-hero-learn').addEventListener('click', () => navigateTo('how-it-works'));
    document.getElementById('btn-start-now').addEventListener('click', () => navigateTo('products'));
    document.getElementById('btn-cta-shop').addEventListener('click', () => navigateTo('products'));
    document.getElementById('btn-view-all-products').addEventListener('click', () => {
        document.querySelector('.category-btn[data-category="all"]').click();
    });

    // Filtro de categorias
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.category-btn.active').classList.remove('active');
            this.classList.add('active');
            filterProducts(this.dataset.category);
        });
    });

    // Slider de depoimentos
    initTestimonialSlider();

    // Painel administrativo
    document.getElementById('btn-admin-panel').addEventListener('click', openAdminPanel);
    document.getElementById('btn-close-admin-modal').addEventListener('click', closeAdminPanel);
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelector('.admin-tab.active').classList.remove('active');
            this.classList.add('active');
            
            document.querySelector('.tab-pane.active').classList.remove('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
    document.getElementById('btn-add-product').addEventListener('click', () => openProductForm());
    document.getElementById('btn-close-product-form').addEventListener('click', closeProductForm);
    document.getElementById('btn-cancel-product').addEventListener('click', closeProductForm);
    document.getElementById('product-form').addEventListener('submit', handleProductForm);

    // Detalhes do pedido
    document.getElementById('btn-close-order-details').addEventListener('click', closeOrderDetailsModal);
}

// Navegação
function navigateTo(section) {
    const element = document.getElementById(section);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
        });
    } else if (section === 'login' || section === 'register') {
        openUserModal();
        if (section === 'register') {
            switchToRegister();
        }
    }
    
    if (document.querySelector('.mobile-menu.active')) {
        toggleMobileMenu();
    }
}

// Toggle menu mobile
function toggleMobileMenu() {
    document.querySelector('.mobile-menu').classList.toggle('active');
}

// Toggle carrinho
function toggleCart() {
    document.querySelector('.cart-sidebar').classList.toggle('active');
    updateCartDisplay();
}

// Adicionar ao carrinho
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity
        });
    }
    
    // Salvar carrinho no LocalStorage
    saveDataToLocalStorage();
    
    updateCartCount();
    showAddToCartAnimation(productId);
    
    // Abrir o carrinho automaticamente
    if (!document.querySelector('.cart-sidebar.active')) {
        toggleCart();
    } else {
        updateCartDisplay();
    }
}

// Atualizar contagem do carrinho
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Mostrar animação de adicionar ao carrinho
function showAddToCartAnimation(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    productCard.classList.add('added');
    
    setTimeout(() => {
        productCard.classList.remove('added');
    }, 1000);
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        document.getElementById('cart-subtotal').textContent = 'R$ 0,00';
        document.getElementById('cart-fee').textContent = 'R$ 0,00';
        document.getElementById('cart-total').textContent = 'R$ 0,00';
        return;
    }
    
    emptyCart.style.display = 'none';
    
    // Limpar itens existentes
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    // Adicionar itens do carrinho
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="cart-quantity-btn minus" data-id="${item.productId}">-</button>
                <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" data-id="${item.productId}">
                <button class="cart-quantity-btn plus" data-id="${item.productId}">+</button>
            </div>
            <div class="cart-item-remove" data-id="${item.productId}">
                <i class="fas fa-trash"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Adicionar eventos aos novos elementos
    cartItemsContainer.querySelectorAll('.cart-quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateCartItemQuantity(this.dataset.id, -1);
        });
    });
    
    cartItemsContainer.querySelectorAll('.cart-quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateCartItemQuantity(this.dataset.id, 1);
        });
    });
    
    cartItemsContainer.querySelectorAll('.cart-quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity >= 1) {
                setCartItemQuantity(this.dataset.id, newQuantity);
            } else {
                this.value = 1;
                setCartItemQuantity(this.dataset.id, 1);
            }
        });
    });
    
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(this.dataset.id);
        });
    });
    
    // Calcular taxa de serviço
    serviceFee = calculateServiceFee(subtotal);
    
    // Atualizar totais
    document.getElementById('cart-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-fee').textContent = `R$ ${serviceFee.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-total').textContent = `R$ ${(subtotal + serviceFee).toFixed(2).replace('.', ',')}`;
}

// Atualizar quantidade de item no carrinho
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        item.quantity = 1;
    }
    
    // Salvar carrinho no LocalStorage
    saveDataToLocalStorage();
    
    updateCartCount();
    updateCartDisplay();
}

// Definir quantidade de item no carrinho
function setCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;
    
    item.quantity = quantity;
    
    // Salvar carrinho no LocalStorage
    saveDataToLocalStorage();
    
    updateCartCount();
    updateCartDisplay();
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    
    // Salvar carrinho no LocalStorage
    saveDataToLocalStorage();
    
    updateCartCount();
    updateCartDisplay();
}

// Calcular taxa de serviço
function calculateServiceFee(subtotal) {
    if (subtotal <= 100) {
        return 30;
    } else if (subtotal <= 200) {
        return 40;
    } else if (subtotal <= 300) {
        return 50;
    } else if (subtotal <= 400) {
        return 60;
    } else if (subtotal <= 500) {
        return 70;
    } else {
        // Para cada 100 reais adicionais, adiciona 10 reais na taxa
        const additional = Math.floor((subtotal - 500) / 100) * 10;
        return 70 + additional;
    }
}

// Verificar usuário logado
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

// Atualizar UI do usuário
function updateUserUI() {
    if (currentUser) {
        document.getElementById('btn-user').innerHTML = `<i class="fas fa-user-check"></i>`;
    } else {
        document.getElementById('btn-user').innerHTML = `<i class="fas fa-user"></i>`;
    }
}

// Abrir modal de usuário
function openUserModal() {
    document.getElementById('user-modal').classList.add('active');
    
    if (currentUser) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('user-modal-title').textContent = 'Minha Conta';
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-profile').style.display = 'none';
        document.getElementById('user-modal-title').textContent = 'Entrar';
    }
}

// Fechar modal de usuário
function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

// Alternar para registro
function switchToRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('user-modal-title').textContent = 'Cadastrar';
}

// Alternar para login
function switchToLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-modal-title').textContent = 'Entrar';
}

// Manipular login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Verificar se o usuário existe
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
        showNotification('Email ou senha inválidos', 'error');
        return;
    }
    
    // Login bem-sucedido
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserUI();
    
    closeUserModal();
    showNotification('Login realizado com sucesso!');
}

// Manipular registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;
    
    // Verificar se o email já está em uso
    if (users.some(u => u.email === email)) {
        showNotification('Este email já está em uso', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone,
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    saveDataToLocalStorage();
    
    // Login automático
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserUI();
    
    closeUserModal();
    showNotification('Cadastro realizado com sucesso!');
}

// Manipular logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    
    closeUserModal();
    showNotification('Logout realizado com sucesso!');
}

// Abrir modal de checkout
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    if (!currentUser) {
        openUserModal();
        showNotification('Faça login para continuar com a compra', 'warning');
        return;
    }
    
    document.getElementById('checkout-modal').classList.add('active');
    showCheckoutSection('address-section');
    updateCheckoutSummary();
}

// Fechar modal de checkout
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

// Mostrar seção de checkout
function showCheckoutSection(sectionId) {
    document.querySelectorAll('.checkout-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
}

// Atualizar resumo do checkout
function updateCheckoutSummary() {
    const summaryItems = document.getElementById('summary-items');
    summaryItems.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <div class="summary-item-name">
                <div class="summary-item-quantity">${item.quantity}</div>
                ${item.name}
            </div>
            <div class="summary-item-price">R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</div>
        `;
        
        summaryItems.appendChild(summaryItem);
    });
    
    // Calcular taxa de serviço
    serviceFee = calculateServiceFee(subtotal);
    
    // Atualizar totais
    document.getElementById('summary-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('summary-fee').textContent = `R$ ${serviceFee.toFixed(2).replace('.', ',')}`;
    document.getElementById('summary-total').textContent = `R$ ${(subtotal + serviceFee).toFixed(2).replace('.', ',')}`;
}

// Alternar formulário de pagamento
function togglePaymentForm() {
    const method = document.querySelector('input[name="payment-method"]:checked').value;
    
    document.getElementById('credit-card-form').style.display = 'none';
    document.getElementById('pix-form').style.display = 'none';
    document.getElementById('boleto-form').style.display = 'none';
    
    document.getElementById(`${method}-form`).style.display = 'block';
}

// Manipular checkout
function handleCheckout(e) {
    e.preventDefault();
    
    const address = document.getElementById('checkout-address').value;
    const city = document.getElementById('checkout-city').value;
    const state = document.getElementById('checkout-state').value;
    const zipcode = document.getElementById('checkout-zipcode').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calcular taxa de serviço
    const serviceFee = calculateServiceFee(subtotal);
    
    // Criar novo pedido
    const newOrder = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        user_name: currentUser.name,
        items: [...cart],
        address: `${address}, ${city} - ${state}, ${zipcode}`,
        payment_method: paymentMethod,
        subtotal: subtotal,
        service_fee: serviceFee,
        total: subtotal + serviceFee,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
    };
    
    // Adicionar pedido à lista
    orders.push(newOrder);
    
    // Salvar no LocalStorage
    saveDataToLocalStorage();
    
    // Limpar carrinho
    cart = [];
    updateCartCount();
    saveDataToLocalStorage();
    
    // Fechar modal de checkout
    closeCheckoutModal();
    
    // Mostrar confirmação
    showOrderConfirmation(newOrder);
}

// Mostrar confirmação de pedido
function showOrderConfirmation(order) {
    document.getElementById('order-confirmation-modal').classList.add('active');
    
    document.getElementById('confirmation-order-id').textContent = order.id;
    document.getElementById('confirmation-total').textContent = `R$ ${order.total.toFixed(2).replace('.', ',')}`;
    
    const paymentInstructions = document.getElementById('payment-instructions');
    
    if (order.payment_method === 'credit_card') {
        paymentInstructions.innerHTML = `
            <p>Seu pagamento com cartão de crédito foi processado com sucesso!</p>
            <p>Você receberá um e-mail com os detalhes da compra.</p>
        `;
        
        // Atualizar status do pedido
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'paid';
            orders[orderIndex].payment_status = 'completed';
            saveDataToLocalStorage();
        }
    } else if (order.payment_method === 'pix') {
        paymentInstructions.innerHTML = `
            <p>Escaneie o QR Code abaixo para pagar com PIX:</p>
            <div class="pix-qrcode">
                <img src="images/pix-placeholder.svg" alt="QR Code PIX">
            </div>
            <p>Ou copie a chave PIX: <strong>oguri@exemplo.com.br</strong></p>
            <p>Seu pedido será processado após a confirmação do pagamento.</p>
        `;
    } else if (order.payment_method === 'boleto') {
        paymentInstructions.innerHTML = `
            <p>Seu boleto foi gerado com sucesso!</p>
            <p>Clique no botão abaixo para visualizar e imprimir:</p>
            <button class="btn btn-secondary">Visualizar Boleto</button>
            <p>Seu pedido será processado após a confirmação do pagamento.</p>
        `;
    }
}

// Fechar modal de confirmação
function closeConfirmationModal() {
    document.getElementById('order-confirmation-modal').classList.remove('active');
}

// Abrir modal de meus pedidos
function openMyOrdersModal() {
    document.getElementById('my-orders-modal').classList.add('active');
    renderMyOrders();
}

// Fechar modal de meus pedidos
function closeMyOrdersModal() {
    document.getElementById('my-orders-modal').classList.remove('active');
}

// Renderizar meus pedidos
function renderMyOrders() {
    const myOrdersList = document.getElementById('my-orders-list');
    const emptyOrders = myOrdersList.querySelector('.empty-orders');
    
    // Filtrar pedidos do usuário atual
    const userOrders = orders.filter(order => order.user_id === currentUser.id);
    
    if (userOrders.length === 0) {
        emptyOrders.style.display = 'flex';
        return;
    }
    
    emptyOrders.style.display = 'none';
    
    // Limpar lista existente
    const existingOrders = myOrdersList.querySelectorAll('.order-card');
    existingOrders.forEach(order => order.remove());
    
    // Ordenar pedidos por data (mais recentes primeiro)
    userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Adicionar pedidos à lista
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-card-header">
                <div class="order-card-id">Pedido #${order.id}</div>
                <div class="order-card-date">${formatDate(order.created_at)}</div>
            </div>
            <div class="order-card-items">
                ${order.items.length} ${order.items.length === 1 ? 'item' : 'itens'}
            </div>
            <div class="order-card-details">
                <div class="order-card-total">Total: R$ ${order.total.toFixed(2).replace('.', ',')}</div>
                <div class="order-card-status ${order.status}">${getStatusText(order.status)}</div>
            </div>
            <button class="btn btn-secondary btn-view-order-details" data-id="${order.id}">Ver Detalhes</button>
        `;
        
        myOrdersList.appendChild(orderCard);
    });
    
    // Adicionar eventos aos botões de detalhes
    document.querySelectorAll('.btn-view-order-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            viewOrderDetails(orderId);
        });
    });
}

// Filtrar produtos
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Inicializar slider de depoimentos
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Mostrar o primeiro depoimento
    showTestimonial(0);
    
    // Eventos dos controles
    document.querySelector('.testimonial-control.prev').addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(newIndex);
    });
    
    document.querySelector('.testimonial-control.next').addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(newIndex);
    });
    
    // Eventos dos pontos
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showTestimonial(i);
        });
    });
    
    // Auto-rotação
    setInterval(() => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(newIndex);
    }, 5000);
}

// Abrir painel administrativo
function openAdminPanel() {
    document.getElementById('admin-modal').classList.add('active');
    loadAdminData();
}

// Fechar painel administrativo
function closeAdminPanel() {
    document.getElementById('admin-modal').classList.remove('active');
}

// Carregar dados do painel administrativo
function loadAdminData() {
    // Carregar produtos
    const productsTable = document.getElementById('products-table').querySelector('tbody');
    productsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.imageUrl}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        productsTable.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-edit-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            openProductForm(productId);
        });
    });
    
    document.querySelectorAll('.btn-delete-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            deleteProduct(productId);
        });
    });
    
    // Carregar pedidos
    const ordersTable = document.getElementById('orders-table').querySelector('tbody');
    ordersTable.innerHTML = '';
    
    // Ordenar pedidos por data (mais recentes primeiro)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    sortedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user_name}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
            <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-view-order" data-id="${order.id}"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-view-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            viewOrderDetails(orderId);
        });
    });
    
    // Carregar usuários
    const usersTable = document.getElementById('users-table').querySelector('tbody');
    usersTable.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="btn-view-user" data-id="${user.id}"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        usersTable.appendChild(row);
    });
}

// Abrir formulário de produto
function openProductForm(productId) {
    document.getElementById('product-form-modal').classList.add('active');
    
    if (productId) {
        // Editar produto existente
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        document.getElementById('product-form-title').textContent = 'Editar Produto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image-url').value = product.imageUrl;
    } else {
        // Novo produto
        document.getElementById('product-form-title').textContent = 'Adicionar Produto';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
    }
}

// Fechar formulário de produto
function closeProductForm() {
    document.getElementById('product-form-modal').classList.remove('active');
}

// Manipular formulário de produto
function handleProductForm(e) {
    e.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;
    const imageUrl = document.getElementById('product-image-url').value || 'images/product-placeholder.svg';
    
    if (productId) {
        // Atualizar produto existente
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name,
                description,
                price,
                stock,
                category,
                imageUrl
            };
        }
    } else {
        // Criar novo produto
        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            price,
            stock,
            category,
            imageUrl
        };
        
        products.push(newProduct);
    }
    
    // Salvar no LocalStorage
    saveDataToLocalStorage();
    
    // Atualizar UI
    renderProducts();
    
    closeProductForm();
    loadAdminData();
    showNotification('Produto salvo com sucesso!');
}

// Excluir produto
function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    // Remover produto do array
    products = products.filter(p => p.id !== productId);
    
    // Salvar no LocalStorage
    saveDataToLocalStorage();
    
    // Atualizar UI
    renderProducts();
    loadAdminData();
    showNotification('Produto excluído com sucesso!');
}

// Ver detalhes do pedido
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('order-details-modal').classList.add('active');
    
    document.getElementById('order-details-id').textContent = order.id;
    document.getElementById('order-details-date').textContent = formatDate(order.created_at);
    document.getElementById('order-details-customer').textContent = order.user_name;
    document.getElementById('order-details-address').textContent = order.address;
    document.getElementById('order-details-status').textContent = getStatusText(order.status);
    document.getElementById('order-details-payment-method').textContent = getPaymentMethodText(order.payment_method);
    
    const itemsContainer = document.getElementById('order-details-items');
    itemsContainer.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
            <td>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
        `;
        
        itemsContainer.appendChild(row);
    });
    
    document.getElementById('order-details-subtotal').textContent = `R$ ${order.subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('order-details-fee').textContent = `R$ ${order.service_fee.toFixed(2).replace('.', ',')}`;
    document.getElementById('order-details-total').textContent = `R$ ${order.total.toFixed(2).replace('.', ',')}`;
    
    // Adicionar botão de atualizar status
    const adminActions = document.getElementById('order-admin-actions');
    adminActions.innerHTML = '';
    
    const updateStatusBtn = document.createElement('button');
    updateStatusBtn.className = 'btn btn-secondary';
    updateStatusBtn.textContent = 'Atualizar Status';
    updateStatusBtn.addEventListener('click', () => {
        updateOrderStatus(order.id);
    });
    
    adminActions.appendChild(updateStatusBtn);
}

// Fechar modal de detalhes do pedido
function closeOrderDetailsModal() {
    document.getElementById('order-details-modal').classList.remove('active');
}

// Atualizar status do pedido
function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let newStatus;
    
    switch (order.status) {
        case 'pending':
            newStatus = 'paid';
            break;
        case 'paid':
            newStatus = 'delivered';
            break;
        case 'delivered':
            newStatus = 'pending';
            break;
        default:
            newStatus = 'pending';
    }
    
    // Atualizar status
    order.status = newStatus;
    
    // Salvar no LocalStorage
    saveDataToLocalStorage();
    
    // Atualizar UI
    document.getElementById('order-details-status').textContent = getStatusText(newStatus);
    loadAdminData();
    
    showNotification('Status do pedido atualizado com sucesso!');
}

// Obter texto do status
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Pendente';
        case 'paid':
            return 'Pago';
        case 'delivered':
            return 'Entregue';
        case 'cancelled':
            return 'Cancelado';
        default:
            return status;
    }
}

// Obter texto do método de pagamento
function getPaymentMethodText(method) {
    switch (method) {
        case 'credit_card':
            return 'Cartão de Crédito';
        case 'pix':
            return 'PIX';
        case 'boleto':
            return 'Boleto';
        default:
            return method;
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Adicionar evento para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-times-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'info':
            return 'fa-info-circle';
        default:
            return 'fa-bell';
    }
}
