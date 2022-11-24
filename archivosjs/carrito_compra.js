
let carrito = JSON.parse(localStorage.getItem("carrito_compras")) || []

let productos = []

const ver_carrito = document.getElementById("ver_carrito")
const modal_container = document.getElementById("modal_container")
const contenido = document.getElementById("contenido")
let carrito_ventana = document.getElementsByClassName("modal_content")

/* Cargo el JSON */
fetch("/archivosjs/productos.json")
    .then(function (res) {
        return res.json()
    })
    .then(function (resultado) {
        for (const key of resultado) {
            productos.push(key)
        }
        dibujar_cartas()
    })

/* Pinto los productos del json */
function dibujar_cartas() {
    productos.forEach((product) => {
        let content = document.createElement("div")
        content.className = "items"
        content.innerHTML = `
        <img class="images_card" src="${product.img}">
        <h3 class="texto_card">${product.nombre}</h3>
        <p class="texto_card">${product.desc}</p>
        <p class="texto_card">PRECIO: $${product.precio} </p>
        `
        contenido.append(content)

        let comprar = document.createElement("button")
        comprar.className = ("boton_card")
        comprar.innerText = "COMPRAR"
        content.append(comprar)
        comprar.addEventListener("click", () => {

            /* No dejo que los productos se repitan */
            const repetido = carrito.some(id_repetido)
            function id_repetido(id_repetido) {
                return id_repetido.id === product.id
            }
            if (repetido) {
                carrito.map((prod) => {
                    if (prod.id === product.id) {
                        prod.cantidad++;
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

}




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

    if (carrito.length >= 1) {
        modalheader.className = "border_modal"
    }
    else {
        modalheader.className = "modal_header"
    }



    /*  modal_container.append(referencia)*/
    const modalBoton = document.createElement("span")
    modalBoton.innerHTML = "❌​"
    modalBoton.className = "modal_cerrar"



    modalheader.append(modalBoton)

    modalBoton.addEventListener("click", () => {
        modal_container.style.display = "none"
    })


    /* dibujo cada producto que compro */
    carrito.forEach((product) => {
        let carrito_container = document.createElement("div");

        carrito_container.className = "modal_content"
        carrito_container.innerHTML = `
                        <div class = "img_wrapper">
                        <img class = "imagenes_carrito" src="${product.img}">
                        </div>
                        <div class = "texto_wrapper">
                        <h3 class = " hh3">${product.nombre}</h3>
                        <p class= "pp">${product.desc}</p>
                        <p class = "pp">Cantidad: ${product.cantidad}</p>
                        <p class = "precio pp">$ ${product.precio}</p>
                        <i onclick="eliminar_productoo(${product.id})" class = "boton fa-solid fa-trash"></i>
                        </div>
                        `
        modal_container.append(carrito_container);

    })


    const precio_total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)
    const total = document.createElement("div")
    total.className = "total_carrito"
    if (precio_total > 1) {
        total.innerHTML = `
                    <p class = "parrafo_total">Subtotal: $${precio_total}</p>
    `
        modal_container.append(total)
    }
    else
        total.innerHTML = `
                    <p class = "carrito_vacio">-TU CARRITO ESTA VACIO-</p>
    `
    modal_container.append(total)

    let boton_compra_final = document.createElement("div");
    boton_compra_final.innerHTML = `<button class = "boton_carrito_compra" id="#boton_final_hide">PAGÁ AHORA</button>
                                    `
    modal_container.append(boton_compra_final)


    if (carrito.length === 0) {
        boton_compra_final.className = "boton_final_hide"
    }
    else {
        boton_compra_final.className = "boton_final_display "
    }






    const botonzera = document.getElementById("#boton_final_hide")
    botonzera.addEventListener("click", aplicar)

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success boton_confirm',
            cancelButton: 'btn btn-danger boton_cancel'
        },
        buttonsStyling: false
    })

    function aplicar(e) {
        e.preventDefault()
        swalWithBootstrapButtons.fire({
            title: '¿Proceder con la compra?',
            html: `<p class="parrafo_compra">El total a pagar es $${precio_total}</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Finalizar compra',
            cancelButtonText: 'Ahora no',
            reverseButtons: false,
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Gracias por tu compra!',
                    carrito.length = 0,
                    pintarCarrito(),
                    guardarStorage()
                )
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                /* swalWithBootstrapButtons.fire(
    
                ) */
            }
        })
    }
}

ver_carrito.addEventListener("click", pintarCarrito)

/* Guardar contenido del carrito en el storage*/
const guardarStorage = () => {
    localStorage.setItem("carrito_compras", JSON.stringify(carrito))
}

/* Borrar productos del carrito*/
const eliminar_productoo = (idProd) => {
    const item = carrito.find((productos) => productos.id === idProd)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    pintarCarrito();
    guardarStorage()
}

