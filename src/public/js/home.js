const socket=io()
let products=[]

const updateProducts=(data)=>{
productsToHtml=''
data.forEach(i=>{
    productsToHtml=productsToHtml+`<tr><td>${i.id}</td><td>${i.title}</td><td>${i.description}</td><td>${i.code}</td><td>${i.price}</td><td>${i.status}</td><td>${i.stock}</td><td>${i.category}</td><td>${i.thumbnails}</td></tr>`
    });
    document.querySelector(".tableBody").innerHTML=productsToHtml
}

socket.on('data_update',data=>{
    const products=data.products
    updateProducts(products)
})

const sendNewProduct=()=>{
    const title=document.querySelector('#title').value
    const description=document.querySelector('#description').value
    const code=document.querySelector('#code').value
    const price=document.querySelector('#price').value
    const status=document.querySelector('#status').value
    const stock=document.querySelector('#stock').value
    const category=document.querySelector('#category').value
    const thumbnails=document.querySelector('#thumbnails').value
    if(!title||!description||!code||!price||!status||!stock||!category||!thumbnails){
        alert('Please complete all fields.')
        return
    }
    const newProduct={title,description, code, price, status, stock, category, thumbnails}
    socket.emit('new_product_to_server',newProduct)
    document.querySelector('#title').value=''
    document.querySelector('#description').value=''
    document.querySelector('#code').value=''
    document.querySelector('#price').value=''
    document.querySelector('#status').value=''
    document.querySelector('#stock').value=''
    document.querySelector('#category').value=''
    document.querySelector('#thumbnails').value=''
}

socket.on('new_products_from_server',data=>{
    updateProducts(data)
})

const deleteProduct=()=>{
    const id=document.querySelector('#id').value
    socket.emit('delete_product',id)
    document.querySelector('#id').value=''    
}

socket.on('update_from_server',data=>{
    updateProducts(data)
})

const input  = document.getElementById('textbox');
const log = document.getElementById('log');
input.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        socket.emit('message',input.value);
        input.value=""
    }
})
socket.on('log',data=>{
    let logs='';
    data.logs.forEach(log=>{
        logs += `${log.socketid} dice: ${log.message}<br/>`
    })
    log.innerHTML=logs;
})