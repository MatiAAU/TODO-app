function addItem(event) {
    event.preventDefault();
    let text = document.getElementById("todo-input");

    db.collection("todo-items").add({
        text: text.value,
        status: "active",
    });
    text.value = "";
}

function getItems() {
    db.collection("todo-items").onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            });
        })
        generateItems(items);
    })
}

function generateItems(items) {

    let itemsHTML = "";
    items.forEach((item) => {
        itemsHTML += `
            <div class="todo-item">
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked" : ""}">
                        <img src="./assets/icon-check.svg" alt="check-mark">
                    </div>
                </div>
                <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
                    ${item.text}
                </div>
            </div>
        `
    })

   // let active = document.getElementById("active");
   // active.addEventListener("click", () => {
  //      if item.status == ""
  //  })

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    document.querySelector(".items-left").innerHTML = `${items.length} items left`
    createEventListeners();
}

function createEventListeners() {
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
    let itemsClear = document.querySelector(".items-clear span");

    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", () => {
            markCompleted(checkMark.dataset.id);

            itemsClear.addEventListener("click", () => {
                clearCompleted(checkMark.dataset.id);
            });
        })
    })

}

function clearCompleted(id) {
    let item = db.collection("todo-items").doc(id);
    item.get().then((doc) => {
        if (doc.exists) {
            let status = doc.data().status;
            if (status == "completed") {
                item.delete();
            }
        }
    })

}

function markCompleted(id) {
    let item = db.collection("todo-items").doc(id);
    item.get().then((doc) => {
        if (doc.exists) {
            let status = doc.data().status;
            if (status == "active") {
                item.update({
                    status: "completed"
                })
            } else if (status == "completed") {
                item.update({
                    status: "active"
                })
            }
        }
    })
}

getItems();