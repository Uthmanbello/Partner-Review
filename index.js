//CLEAR.JS

const toggleStatus = (task) => { task.completed = !(task.completed); };

//TODO.JS

class TodoList {
  constructor(todolist) {
    this.todolist = todolist;
  }

  addTask(description, index) {
    const newTask = new Todo(description, index);
    this.todolist.push(newTask);
  }

  removeTask(index) {
    this.todolist.splice((index - 1), 1);
    const updatedTodoList = this.todolist.map((object) => {
      if (object.index > index) {
        const ind = object.index - 1;
        return { ...object, index: ind };
      }
      return object;
    });
    this.todolist = updatedTodoList;
  }

  editTask(description, index) {
    const updatedTodoList = this.todolist.map((object) => {
      if (parseInt(object.index, 10) === parseInt(index, 10)) {
        return { ...object, description };
      }
      return object;
    });
    this.todolist = updatedTodoList;
  }

  getTaskByIndex(index) {
    return this.todolist.filter((obj) => parseInt(obj.index, 10) === parseInt(index, 10))[0];
  }
}

//TODOCONST.JS

class Todo {
  constructor(description, index) {
    this.description = description;
    this.index = index;
    this.completed = false;
  }
}

//INDEX.JS

let todolist = [];
if (JSON.parse(localStorage.getItem('todolist'))) {
  todolist = JSON.parse(localStorage.getItem('todolist')).todolist;
}
const newTodoList = new TodoList(todolist);
const todoItems = document.getElementsByClassName('todolist')[0];
const save = () => {
  localStorage.setItem('todolist', JSON.stringify(newTodoList));
}

const sortedTodoList = todolist.sort((a, b) => a.index - b.index);

sortedTodoList.forEach((todo) => {
  const task = document.createElement('li');
  task.classList.add('task');
  task.id = todo.index;
  task.innerHTML = `<input type="checkbox" name="${todo.index}" class="check">
  <label class = "${todo.index} task-desc black" for="${todo.index}">${todo.description}</label>
  <div class="remove-button">
    <i class='fa fa-trash ash'></i>
  <div>`;
  todoItems.appendChild(task);
});

const inputButton = document.getElementById('submit-new-item');
const enter = document.querySelector('.icon');

const addTask = (e) => {
  e.preventDefault();
  const newItem = document.getElementById('new-item');
  if (newItem.value) {
    const description = newItem.value.trim();
    const index = todolist.length + 1;
    newTodoList.addTask(description, index);
    save();
    newItem.value = '';
  }
  window.location.reload();
};

inputButton.addEventListener('click', addTask);
enter.addEventListener('click', addTask);

const editTaskButton = document.querySelectorAll('.task');
editTaskButton.forEach((elm) => {
  const element = elm.children[1];
  element.addEventListener('click', () => {
    element.contentEditable = true;
    element.focus();
  });

  element.addEventListener('focusout', () => {
    if (element.innerHTML) {
      newTodoList.editTask(element.innerHTML, element.className);
      save();
      element.contentEditable = false;
    }
  });
  element.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && element.innerHTML) {
      newTodoList.editTask(element.innerHTML, element.className);
      save();
      element.contentEditable = false;
    }
  });
});

const removeButton = document.querySelectorAll('.remove-button');

const removeTask = (e) => {
  const index = e.target.parentNode.parentNode.id;
  newTodoList.removeTask(index);
  save();
  window.location.reload();
};

removeButton.forEach((element) => element.addEventListener('click', removeTask));

const checkBox = (e) => {
  const i = e.target.name;
  const task = newTodoList.getTaskByIndex(i);
  toggleStatus(task);
  newTodoList.todolist[i - 1] = task;
  save();
};

const tasks = document.querySelectorAll('.task');
tasks.forEach((e) => {
  const checkInput = e.childNodes[0];
  checkInput.addEventListener('change', checkBox);
});

const clearButton = document.getElementsByClassName('link-button')[0];

const clearCompleted = () => {
  const filteredList = newTodoList.todolist.filter((e) => e.completed === false);
  const sortedList = filteredList.map((object, i) => {
    const index = i + 1;
    return { ...object, index };
  });
  newTodoList.todolist = sortedList;
  save();
  window.location.reload();
};

clearButton.addEventListener('click', clearCompleted);
