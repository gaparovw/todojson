// ! TODOS

/** 
 *GET - Получить данные
 *PATCH - Частичное изменение
 *PUT - Полная замена данных
 *POST - Добавление данных
 *DELETE - Удаление 
 *
 * CRUD - Create(POST-REQUEST) Read(GET-REQUEST) Update(PUT/PATCH) Delete(DELETE)
*/

// API - Application programming interface


//? 
const API = "http://localhost:8000/todos";
let inpAdd = document.getElementById("inp-add");
let btnAdd = document.getElementById("btn-add");

let inpSearch = document.getElementById("inp-search")

btnAdd.addEventListener("click", async ()=>{
    let newTodo = {
        todo: inpAdd.value,
    }
    if(newTodo.todo.trim()===""){
        alert("Заполните поля!");
        return;    
    }
    await fetch(API, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    });
    inpAdd.value = "";
    getTodos();
});


//! pagination

let pagination = document.getElementById("pagination")

let page = 1;


getTodos();
//! READ
//!Search
inpSearch.addEventListener("input", ()=>{
    // console.log("INPUT")
    getTodos()
})
let list = document.getElementById("list");
async function getTodos(){
    let responce = await fetch(`${API}?q=${inpSearch.value}&_page=${page}&_limit=3`).then((res)=>res.json());

    let allTodos = await fetch(API).then((res)=>res.json())
    console.log(allTodos)

        let lastPage = Math.ceil(allTodos.length / 2) -1;
    console.log(lastPage);


    list.innerHTML = "";
    responce.forEach((item)=>{
        let newElem = document.createElement("div");
        newElem.id = item.id;
        console.log(item.todo);
        newElem.innerHTML = `
        <span>${item.todo}</span>
        <button class="btn-delete">Delete</button>
        <button class="btn-edit">Edit</button>
        `;
        list.append(newElem);

    })
  pagination.innerHTML = `
  <button ${page === 1 ? "disabled" : ""} 
  id="btn-prev" > назад </button>
  <span>${page}</span>
  <button ${page === lastPage ? "disabled" : ""}  id="btn-next">вперед</button>
  `
}



document.addEventListener("click", async(event)=>{
    if(event.target.className === "btn-delete"){
       let id =event.target.parentNode.id;
       await fetch(`${API}/${id}`, {
method:"DELETE"
       })
       getTodos()
    }



    //! Update 
    if(event.target.className === "btn-edit"){
        modalEdit.style.display = "flex"
        let id =event.target.parentNode.id;
        let response = await fetch(`${API}/${id}`)
        .then((res) => res.json())
        .catch((err) => console.log(err))
        console.log(response)
        inpEditTodo.value = response.todo
        inpEditTodo.className = response.id
    }
    if(event.target.id==="btn-next"){
        page++;
        getTodos();
    }
    if(event.target.id==="btn-prev"){
        page--;
        getTodos();
    }

})
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditTodo = document.getElementById("inp-edit-todo");
let btnSaveEdit = document.getElementById("btn-save-edit");

btnSaveEdit.addEventListener("click", async (event)=>{
    let editedTodo = {
        todo: inpEditTodo.value,
    }
    let id = inpEditTodo.className
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }
    })
    modalEdit.style.display = "none";
    getTodos()
})
modalEditClose.addEventListener("click", function(){
      modalEdit.style.display = "none"
})
