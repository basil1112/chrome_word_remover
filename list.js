console.log('***************list******************')
let BASE_URL = "http://localhost:3000";


function ondelete(id) {

  let _id = id.trim();

  fetch(`${BASE_URL}/deleteKeyword`, {
    method: "POST",
    body: JSON.stringify({
      id: _id
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => console.log(">>>>>", response))
    .then(data => {
      console.log("deleted!!!!");
      loadFromAPI();
    })

}

function loadFromAPI() {

  let tbody = document.getElementById('tbody');
  tbody.innerHTML = "";

  fetch(`${BASE_URL}/getAllKeywords`)
    .then(response => response.json())
    .then(data => {

      tbody.innerHTML = "";
      setTimeout(() => {
        let value = JSON.parse(JSON.stringify(data));
        console.log(value);
        let tbody = document.getElementById('tbody');
        tbody.innerHTML = "";
        let row = "";
        for (i = 0; i < value.length; i++) {
          row = row + `<tr><td>${i + 1}</td><td>${value[i].keyword}</td><td> <input type="hidden" value='${value[i].id}'/> <input type='button' id='${value[i].id}' value="Delete"/></td></tr>`
        }
        tbody.innerHTML = tbody.innerHTML + row;
      }, 200);


    });


  $('#word_table').on('click', 'input[type="button"]', function (e) {
    console.log($(this).closest('tr'));
    let value = $(this).closest('tr').find('input[type="hidden"]').val();
    ondelete(value);
  })

}

loadFromAPI();


document.getElementById('word_table')