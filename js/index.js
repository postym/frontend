// Search Form
const messageSearchForm = document.getElementById("message_search_form");
messageSearchForm.onsubmit = searchMessages;

async function searchMessages(e) {
  e.preventDefault();

  const formData = new FormData(messageSearchForm);

  getMessages(formData.get("keyword"));
}

// Get All Messages
getMessages();

async function getMessages(keyword = "") {
  const response = await fetch(
    "http://backend.test/api/message?keyword=" + keyword,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.ok) {
    const result = await response.json();

    let container = "";
    result.forEach((element) => {
      const dateTime = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12 mb-3">
      <div class="card w-100" data-id="${element.message_id}">
        <div class="card-body">
          <div class="dropdown float-end">
            <button
              class="btn btn-outline-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" id="btn_edit" data-id="${element.message_id}">Edit</a></li>
              <li><a class="dropdown-item" href="#" id="btn_delete" data-id="${element.message_id}">Delete</a></li>
            </ul>
          </div>
          <h5 class="card-title">${element.name}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">
            <small>${dateTime}</small>
          </h6>
          <p class="card-text">
            ${element.message}
          </p>
        </div>
      </div>
    </div>`;
    });

    document.getElementById("get_messages").innerHTML = container;

    const editBtns = document.querySelectorAll("#btn_edit");
    Array.from(editBtns, (element) => {
      element.addEventListener("click", editAction);
    });

    const deleteBtns = document.querySelectorAll("#btn_delete");
    Array.from(deleteBtns, (element) => {
      element.addEventListener("click", deleteAction);
    });
  }
}

// Message Form
const messageForm = document.getElementById("message_form");
messageForm.onsubmit = submitMessage;

async function submitMessage(e) {
  e.preventDefault();

  document.querySelector('#message_form button[type="submit"]').disabled = true;

  const formData = new FormData(messageForm);

  let id = document.querySelector('input[type="hidden"]').value;
  let forUpdate = id.length > 0 ? true : false;

  const response = await fetch(
    "http://backend.test/api/message" + (forUpdate ? "/" + id : ""),
    {
      method: forUpdate ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
      },
      body: forUpdate ? new URLSearchParams(formData) : formData,
    }
  );

  if (response.ok) {
    const result = await response.json();
    console.log(result);

    document.querySelector('input[type="hidden"]').value = "";
    document.querySelector('#message_form button[type="submit"]').innerHTML =
      "Submit";

    messageForm.reset();
    getMessages();
  } else if (response.status == 422) {
    const result = await response.json();
    console.log(result);

    alert(result.message);
  }

  document.querySelector(
    '#message_form button[type="submit"]'
  ).disabled = false;
}

// Select Action
const selectMessage = async (id) => {
  const response = await fetch("http://backend.test/api/message/" + id, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result);

    document.querySelector('input[name="user_id"]').value = result.user_id;
    document.querySelector('textarea[name="message"]').value = result.message;
    document.querySelector('input[type="hidden"]').value = result.message_id;

    document.querySelector('#message_form button[type="submit"]').innerHTML =
      "Update";

    document.querySelector(`div[data-id="${id}"]`).style.backgroundColor =
      "yellow";
  } else if (response.status == 404) {
    alert("Does not exist!");
  }
};

// Edit Action
const editAction = async (e) => {
  const id = e.currentTarget.getAttribute("data-id");

  selectMessage(id);
};

// Delete Action
const deleteAction = async (e) => {
  if (confirm("Are you sure you want to delete?")) {
    const id = e.currentTarget.getAttribute("data-id");

    document.querySelector(`div[data-id="${id}"]`).style.backgroundColor =
      "red";

    const response = await fetch("http://backend.test/api/message/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);

      getMessages();
      alert("Successfully Deleted!");
    } else {
      alert("Unable to delete");
    }
  }
};
