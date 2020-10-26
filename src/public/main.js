const updateBtn = document.querySelector("#update-button");
const deleteBtn = document.querySelector("#delete-button");
const messageDiv = document.querySelector('#message')

const main = {
    init() {
        this.FetchUpdate();
        this.FetchDelete();
    },

    FetchUpdate() {
        if (updateBtn) {
            updateBtn.addEventListener("click", () => {
                console.log("hello");
                // Do a PUT request using the Fetch API
                // fetch(enpoint, options)
            
                //EX /quotes is where we are sending this request. Everything after is the options
                fetch("/quotes", { 
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Darth Vader",
                        quote: "I Find You're Lack Of Faith Disturbing."
                    })
                 })
                 .then(res => {
                    if (res.ok) return res.json()
                  })
                  .then(response => {
                    window.location.reload(true)
                  })
            });
        }
    },

    FetchDelete() {
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                fetch("/quotes", {
                    method: "delete",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Darth Vader'
                    })
                })
                .then(res => {
                    if (res.ok) return res.json()
                })
                .then(response => {
                    if (response === 'No quote to delete') {
                      messageDiv.textContent = 'No Darth Vadar quote to delete'
                    } else {
                      window.location.reload(true)
                    }
                  })
                  .catch(error => console.error(error))
            })
        }
    }

}

main.init();