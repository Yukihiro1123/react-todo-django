import axios from 'axios';
const baseUrl = 'http://127.0.0.1:8000/api/projects/api/todo/';
const projectUrl = 'http://127.0.0.1:8000/api/projects/';

const addTask = async task => {
  await axios
    .post(
      `${baseUrl}`,
      JSON.stringify(task),
      //   {newTask},
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //console.log(response.data);
    })
    .catch(error => console.log(error));
};

const editTask = async (id, task) => {
  console.log(`${baseUrl}${id}`);
  console.log(JSON.stringify(task));
  await axios
    .put(
      `${baseUrl}${id}/`,
      JSON.stringify(task),
      //   {newTask},
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //   console.log(response.data);
    })
    .catch(error => console.log(error));
};

const finishTask = async task => {
  console.log([`${baseUrl}${task.id}`]);
  const comptask = {
    id: task.id,
    title: task.title,
    category: task.category,
    description: task.description,
    startDate: task.startDate,
    endDate: task.endDate,
    priority: task.priority,
    emergency: task.emergency,
    completed: !task.completed,
  };
  await axios
    .put(`${baseUrl}${task.id}/`, JSON.stringify(comptask), {
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //   console.log(response.data);
    })
    .catch(error => console.log(error));
};

const deleteTask = async id => {
  //タスクを消すのが早すぎるとundefined
  console.log(`${baseUrl}${id}`);
  await axios
    .delete(`${baseUrl}${id}`)
    .then(response => {
      console.log(response);
      console.log(response.data);
    })
    .catch(error => console.log(error));
};

//プロジェクト

const addProject = async project => {
  await axios
    .post(
      `${projectUrl}`,
      JSON.stringify(project),
      //   {newTask},
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //console.log(response.data);
    })
    .catch(error => console.log(error));
};

const editProject = async (id, project) => {
  console.log(`${projectUrl}${id}`);
  console.log(JSON.stringify(project));
  await axios
    .put(
      `${projectUrl}${id}/`,
      JSON.stringify(project),
      //   {newTask},
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //   console.log(response.data);
    })
    .catch(error => console.log(error));
};

const finishProject = async project => {
  console.log([`${projectUrl}${project.id}`]);
  const compproj = {
    id: project.id,
    projectName: project.projectName,
    overview: project.overview,
    deadline: project.deadline,
    completed: !project.completed,
  };
  await axios
    .put(`${projectUrl}${project.id}/`, JSON.stringify(compproj), {
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.data)
    .then(response => {
      console.log(response);
      //   console.log(response.data);
    })
    .catch(error => console.log(error));
};

const deleteProject = async id => {
  //タスクを消すのが早すぎるとundefined
  console.log(`${projectUrl}${id}`);
  await axios
    .delete(`${projectUrl}${id}`)
    .then(response => {
      console.log(response);
      console.log(response.data);
    })
    .catch(error => console.log(error));
};

module.exports = {
  addTask,
  deleteTask,
  editTask,
  finishTask,
  addProject,
  deleteProject,
  editProject,
  finishProject,
};
