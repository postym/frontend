// Get All Messages
getMessages();

async function getMessages() {
  let response = await fetch("http://backend.test/api/message", {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    let json = await response.json();

    let container = "";
    json.forEach((element) => {
      const date = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12 mb-3">
                    <div class="card w-100">
                      <div class="card-body">
                        <div class="dropdown float-end">
                          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item" href="#" id="btn_edit">Edit</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#" id="btn_delete">Delete</a>
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
  } else {
    alert("HTTP-Error: " + response.status);
  }
}
