// Get Users for Selection
getUsersSelection();
async function getUsersSelection() {
  const response = await fetch("http://backend.test/api/user/selection", {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const json = await response.json();

    let container = '<option value="">Select User</option>';
    json.forEach((element) => {
      container += `<option value="${element.id}">${element.name}</option>`;
    });

    document.querySelector('#message_form select[name="user_id"]').innerHTML =
      container;
  }
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
    const json = await response.json();

    let container = "";
    json.forEach((element) => {
      const date = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12">
                    <div class="card w-100 mt-3" data-id="${element.message_id}">
                      <div class="card-body">
                        <div class="dropdown float-end">
                          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item" href="#" id="btn_edit" data-id="${element.message_id}">Edit</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#" id="btn_delete" data-id="${element.message_id}">Delete</a>
                            </li>
                          </ul>
                        </div>
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">
                          <small>${date}</small>
                        </h6>
                        <p class="card-text">${element.message}</p>
                      </div>
                    </div>
                  </div>`;
    });

    document.getElementById("get_messages").innerHTML = container;

    document.querySelectorAll("#btn_edit").forEach((element) => {
      element.addEventListener("click", editAction);
    });

    document.querySelectorAll("#btn_delete").forEach((element) => {
      element.addEventListener("click", deleteAction);
    });
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

// Search Form
const message_search_form = document.getElementById("message_search_form");
message_search_form.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(message_search_form);
  const keyword = formData.get("keyword");

  getMessages(keyword);
};

// Create/Update Message
const message_form = document.getElementById("message_form");
message_form.onsubmit = async (e) => {
  e.preventDefault();

  document.querySelector("#message_form button").disabled = true;

  const formData = new FormData(message_form);

  const id = document.querySelector('#message_form input[type="hidden"]').value;
  const forUpdate = id.length > 0 ? true : false;

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
    const json = await response.json();
    console.log(json);

    message_form.reset();
    getMessages();
  } else if (response.status == 422) {
    const json = await response.json();

    alert(json.message);
  }

  document.querySelector("#message_form button").disabled = false;
  document.querySelector("#message_form button").innerHTML = "Submit";
};

// Delete Message
const deleteAction = async (e) => {
  if (confirm("Are you sure you want to delete")) {
    const id = e.target.getAttribute("data-id");

    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "red";

    const response = await fetch("http://backend.test/api/message/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);

      document.querySelector(`.card[data-id="${id}"]`).remove();
      // getMessages();
    } else {
      alert("Unable to delete!");
    }
  }
};

// Update Message
const editAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  showMessage(id);
};

// Show Message
const showMessage = async (id) => {
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
    "yellow";

  const response = await fetch("http://backend.test/api/message/" + id, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const json = await response.json();

    document.querySelector('#message_form input[type="hidden"]').value =
      json.message_id;
    document.querySelector('#message_form select[name="user_id"]').value =
      json.user_id;
    document.querySelector('#message_form textarea[name="message"]').value =
      json.message;
    document.querySelector("#message_form button").innerHTML = "Update";
  } else {
    alert("Unable to show!");
  }
};
