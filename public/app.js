'use strict';
document.addEventListener('DOMContentLoaded', function() {
    connect();

const todoInput = document.querySelector('#todoInput');
const ulList =  document.querySelector(".list");

ulList.addEventListener('click', function(e){
    if(e.target && e.target.nodeName == "SPAN") {
            e.stopPropagation();
            var todo = e.target;
            deleteToDo(todo)
            .then(function(){
               todo.parentNode.remove(todo);
            })
            .catch(function(err){
                console.log(err);
	        })}
	        else if(e.target && e.target.nodeName == "LI"){
	            var todo = e.target;
	            updateToDo(todo)
	            .then(function(){
	                todo.classList.toggle('done');
	            })
	            .catch(function(err){
	                console.log(err);
	            })
	        }
});



todoInput.addEventListener('keypress', function (e) {
    if (e.which === 13) { 
        createTodo()
       .then(function(toDo){
                todoInput.value = '';
                addToDo(JSON.parse(toDo.target.response));
       })
        .catch(function(err){
                console.log(err);
    })}
});

function connect(){
const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
  if(xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      data.forEach(function(data){
            addToDo(data);
      });
    } 
  };
xhr.open("GET", 'api/todos');
xhr.send();
}

function addToDo(data){
     var newTodo = document.createElement('li');
     var newSpan = document.createElement('span');
        newTodo.classList.add('task');
        newTodo.textContent = data.name;
        newTodo.dataset.id = data._id;
        newTodo.dataset.completed = data.completed;
        newSpan.textContent = 'X';
        newTodo.appendChild(newSpan);
            if(data.completed){
                newTodo.classList.add('done');  
             }
            ulList.appendChild(newTodo);
}

function createTodo(){
    return new Promise(function(res, rej) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/todos');
    xhr.onload = res;
    xhr.onerror = rej;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({name:todoInput.value}));
})}


function deleteToDo(todo){
    var idTodo = todo.parentNode.dataset.id;
    var deleteUrl = 'api/todos/' + idTodo;
    return new Promise(function(res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", deleteUrl, true);
        xhr.onload = res;
        xhr.send();
    });
}

function updateToDo(todo){
    var idTodo = todo.dataset.id;
    var completedTodo = todo.dataset.completed;
    if (completedTodo == 'false'){
        todo.setAttribute("data-completed", "true");
        completedTodo = true;
    } else {
        todo.setAttribute("data-completed", "false");
        completedTodo = false;
    }
    var sendTodo = (JSON.stringify({completed:completedTodo}));
    var updateUrl = 'api/todos/' + idTodo;
    return new Promise(function(res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", updateUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = res;
        xhr.send(sendTodo);
    })}

});
