let state = {
    products: [],
    editedId: ''
}

window.onload = render();

function render() {

    fetch('/products')
    .then(response => response.json())
    .then(response => {
        state.products = response;

        let productsHTML = '';
        for(let product of state.products) {
            productsHTML += `
            <div class="product">
                <h3>${product.name}</h3>
                <span>${product.price} ft</span>
                <input type="button" value="szerkesztés" class="updateBtn" data-id=${product.id}>
                <input type="button" value="törlés" class="deleteBtn" data-id=${product.id}>
            </div>
            `;
        }
        document.querySelector('.products').innerHTML = productsHTML;

        //delete
        for(let deleteBtn of document.querySelectorAll('.deleteBtn')) {
            deleteBtn.onclick = async (event) => {
                const id = event.target.dataset.id;

                const response = await fetch(`/products/${id}`, {
                    method: 'delete'
                })

                if(!response.ok) {
                    alert('Törlés sikertelen');
                    return;
                }

                render();

            }
        }

        //create
        document.getElementById('create').onsubmit = async (event) => {
            event.preventDefault();
            const name = event.target.elements.name.value;
            const price = Number(event.target.elements.price.value);
            const isInStock = Boolean(event.target.elements.isInStock.checked);
        
            let body = {
                name: name,
                price: price,
                isInStock: isInStock
            }

            const newProduct = await fetch('/products', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                }
            })

            console.log(newProduct);
            render();
        }

        //update
        for(let editBtn of document.querySelectorAll('.updateBtn')) {
            editBtn.onclick = (event) => {
                state.editedId = event.target.dataset.id;
                renderEdit();
            }
        }


    })
}

function renderEdit() {
    let editHTML = '';
    for(let product of state.products) {
        if(product.id===state.editedId) {
            editHTML += `
            <form id="edit">
                <input type="text" name="name" placeholder="név" value="${product.name}">
                <input type="number" name="price" placeholder="ár" value="${product.price}">
                <input type="checkbox" name="isInStock" ${product.isInStock ? 'checked' : ''}> Van raktáron?
                <input type="submit" value="szerkeszt">
            </form>
            `;
        }
    }
    document.querySelector('.update-product').innerHTML = editHTML;

    document.getElementById('edit').onsubmit = async (event) => {
        event.preventDefault();
        let editProduct = {
            name: event.target.elements.name.value,
            price: Number(event.target.elements.price.value),
            isInStock: Boolean(event.target.elements.isInStock.value)
        }
        const res = await fetch(`/products/${state.editedId}`, {
            method: 'put',
            body: JSON.stringify(editProduct),
            headers: {
                'content-type': 'application/json'
            }
        })
        state.editedId='';
        document.querySelector('.update-product').innerHTML = '';
        render();
    }

}
