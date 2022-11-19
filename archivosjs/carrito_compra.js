let carrito = JSON.parse(localStorage.getItem("carrito_compras")) || []

const ver_carrito = document.getElementById("ver_carrito")
const modal_container = document.getElementById("modal_container")
const contenido = document.getElementById("contenido")

productos.forEach((product)=>{
    let content = document.createElement("div")
    content.className = "items"
    content.innerHTML = `
    <img class="images_card" src="${product.img}">
    <h3>${product.nombre}</h3>
    <p>${product.desc}</p>
    <p>${product.precio} $</p>
    <p>${product.id}</p>
    `
    contenido.append(content)

    let comprar = document.createElement("button")
    comprar.innerText = "COMPRAR"
    content.append(comprar)
    comprar.addEventListener("click", () =>{    


    
        const repetido = carrito.some(id_repetido)
        function id_repetido(id_repetido){
        return id_repetido.id === product.id
        } 
        
        if (repetido){
            carrito.map((prod) => {
                if (prod.id === product.id){
                    prod.cantidad ++;                    
                }
            }) 
            } 
        else {
        carrito.push({
            id: product.id,
            nombre: product.nombre,
            cantidad: product.cantidad,
            desc: product.desc,
            precio: product.precio,
            img: product.img,        
        }) 
        
    }
    guardarStorage()
    pintarCarrito()
    })
})
console.log(carrito)


/* Dibujar el carrito*/
const pintarCarrito = () => {
    modal_container.innerHTML = ""
    modal_container.style.display = "block"
    const modalheader = document.createElement("div")
    modalheader.className = "modal_header"
    modalheader.innerHTML = `
    <h1 class = "titulo_carrito_desplegable">Carrito de compras</h1>
    `
    let referencia = document.createElement("div")
    referencia.className = "contenedor_referencias"
    referencia.innerHTML = `
                    <p class="referencias"></p>
                    <p class="referencias">Nombre</p>
                    <p class="referencias">Cantidad</p>
                    <p class="referencias">Precio</p>
                    `
    modal_container.append(modalheader)
   /*  modal_container.append(referencia)*/
    const modalBoton = document.createElement("span")
    modalBoton.innerHTML = "❌​"
    modalBoton.className = "modal_cerrar"
    

    modalheader.append(modalBoton)

    modalBoton.addEventListener ("click", () => {
        modal_container.style.display = "none"
    })
    console.log(carrito)
    carrito.forEach((product) => {
        let carrito_container = document.createElement("div");
        
        carrito_container.className = "modal_content"
        carrito_container.innerHTML = `
                        <div class = "img_wrapper">
                        <img class = "imagenes_carrito" src="${product.img}">
                        </div>

                        <div class = "texto_wrapper">
                        <h3 class = "texto_items_carrito hh3">${product.nombre}</h3>
                        <p class= "pp">${product.desc}</p>
                        <p class = "texto_items_carrito pp">Cantidad: ${product.cantidad}</p>
                        <p class = "texto_items_carrito pp">$ ${product.precio}</p>
                        <i onclick="eliminar_productoo(${product.id})" class = "boton fa-solid fa-trash"></i>
                        </div>
                        `
                        modal_container.append(carrito_container);  
                        
    /*    const remover_objeto = document.createElement("i")
        remover_objeto.className = "fa-solid fa-trash remover_objeto"
        carrito_container.append(remover_objeto)

        remover_objeto.addEventListener("click", eliminar_producto)
    */

    }) 

    const precio_total = carrito.reduce((acc, el) => acc + el.precio*el.cantidad, 0)
    const total = document.createElement("div")
    total.className = "total_carrito"
    if (precio_total > 1){
    total.innerHTML = `
                    <p class = "parrafo_total">Subtotal: $${precio_total}</p>
    `
    modal_container.append(total)
    }
    else 
    total.innerHTML = `
                    <p class = "carrito_vacio">TU CARRITO ESTA VACIO</p>
    `
    modal_container.append(total)
}

ver_carrito.addEventListener ("click", pintarCarrito)
const eliminar_producto = () =>{
    const id_producto = carrito.find((producto) => producto.id)
    carrito = carrito.filter((id_carrito) => {
        return id_carrito !== id_producto
    })

    pintarCarrito()
}

const guardarStorage = () =>{
localStorage.setItem("carrito_compras", JSON.stringify(carrito))
}

const eliminar_productoo = (idProd) =>{
    const item = carrito.find((productos) => productos.id === idProd)
    const indice = carrito.indexOf(item)
    carrito.splice(indice,1)
    pintarCarrito(); 
}