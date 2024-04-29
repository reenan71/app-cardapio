const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById("cart-total");
const closeModalbtn = document.getElementById('close-modal-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');


let cart = [];

// Abrir o modal
cartBtn.addEventListener("click", function(){
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar o modal
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none";
  }
})

closeModalbtn.addEventListener("click", function(){
  cartModal.style.display = "none";
})

//Adicionar ao carrinho
menu.addEventListener("click", function(event){
  let parentButton = event.target.closest(".add-to-cart-btn")

  if(parentButton){
    const nome = parentButton.getAttribute("data-name")
    const preco = parseFloat(parentButton.getAttribute("data-price"))
    

    addToCart(nome, preco)
  }

})

function addToCart(nome, preco){
  const hasItemInCart = cart.find(item => item.nome === nome);

  if(hasItemInCart){
    hasItemInCart.quantidade += 1;
  }else{
    cart.push({
      nome,
      preco, 
      quantidade: 1,
    })
    Toastify({
      text: "Item adicionado com sucesso!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "rgb(34 197 94)",
      },
  }).showToast();
}
  updateCartModal();
}

function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-bold">${item.nome}</p>
        <p class="font-medium">Quantidade: ${item.quantidade}</p>
        <p class="font-medium mt-2">R$ ${item.preco.toFixed(2)}</p>
      </div>
      <div>
        <button class="remove-item-cart-btn" data-name="${item.nome}">
          Remover
        </button>
      </div>
    </div>
    `
    total+= item.preco * item.quantidade;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-item-cart-btn")){
    const nomeItem = event.target.getAttribute("data-name")

    removeItemCart(nomeItem)
  }
})

function removeItemCart(nomeItem){
  const index = cart.findIndex(item => item.nome === nomeItem);

  if(index !== -1){
    const item = cart[index];
    if(item.quantidade > 1 ){
      item.quantidade -= 1;
      Toastify({
        text: "Item removido com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#ef4444",
        },
    }).showToast();
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    Toastify({
      text: "Item removido com sucesso!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
  }).showToast();
    updateCartModal();
    
  }
}

//Pegando campo de endereço
addressInput.addEventListener('input', function(event) {
  let inputValue = event.target.value;

  if (inputValue !== '') {
      addressInput.classList.remove('border-red-500')
      addressWarn.classList.add('hidden')
  }
});

checkoutBtn.addEventListener("click", function(){
  const isOpen = checkIsOpen();
  if(!isOpen){
    Toastify({
      text: "Estamos fechados no momento, nosso horario de funcionamento é das 18h ás 23h",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }


  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  const cartItems = cart.map((item) => {
    return (
      `${item.nome} Quantidade: (${item.quantidade}) Preço: R$${item.preco}) | `
  )
  }).join("")
  const message = encodeURIComponent(cartItems)
  const phoneNumber = "47992748309"

  window.open(`https://wa.me/${phoneNumber}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();
})

function checkIsOpen(){
  const data = new Date();

  const hora = data.getHours();
  return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkIsOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add('bg-green-500');
}else{
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}