let db;

//

const request = indexedDB.open('budget-tracker', 1);

//

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

//on success

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        addTransaction();
    }
};

//on error

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// save

function saveRecord(record) {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    store.add(record);

    //
    };

function addTransaction() {
    //
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    const getAll = store.getAll();
    //

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
              .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //
                const transaction = db.transaction(["new_budget"], "readwrite");
                const store = transaction.objectStore("new_budget");
                //
                store.clear();
            }).catch(err => {
                console.log(err);
            });
        }

    }
}

window.addEventListener("online", addTransaction); 