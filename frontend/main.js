/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */

const SERVER_URL = "http://localhost:3000";

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });

  let data = await response.json();

  return data;
}

async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + "/api/students/" + id, {
    method: "DELETE",
  });

  let data = await response.json();

  return data;
}

async function serverGetStudents() {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  let data = await response.json();

  return data;
}

let serverData = await serverGetStudents();

let studentsList = [];

if (serverData !== null) studentsList = serverData;

const tableStudents = document.querySelector(".tbody");
const studentAddForm = document.getElementById("form-add-student");
const filterForm = document.getElementById("form-filter");
const studentAddButton = document.querySelector(".btn-primary");
const inputSurname = document.getElementById("surname");
const inputName = document.getElementById("name");
const inputPatronymic = document.getElementById("patronymic");
const inputFaculty = document.getElementById("faculty");
const inputBirthDate = document.getElementById("birthDate");
const inputLearningYears = document.getElementById("learningYears");
const inputFIOFilter = document.getElementById("filter-fio");
const inputFacultyFilter = document.getElementById("filter-faculty");
const inputBirthDateFilter = document.getElementById("filter-birth-date");
const inputLearningYearsFilter = document.getElementById(
  "filter-learning-years"
);

const inputsArray = [
  inputSurname,
  inputName,
  inputPatronymic,
  inputFaculty,
  inputBirthDate,
  inputLearningYears,
];
let sortColFlag = "fullNameUser";
let sortDirFlag = true;

studentAddButton.disabled = true;

inputsArray.forEach((input) => {
  input.addEventListener("input", () => {
    inputsArray.every((input) => input.value.trim() !== "")
      ? (studentAddButton.disabled = false)
      : (studentAddButton.disabled = true);
  });
});

function createTableHead() {
  const tableHeadRow = document.createElement("tr");
  const tDFIO = document.createElement("td");
  const tDFaculty = document.createElement("td");
  const tDBirthDate = document.createElement("td");
  const tDLearningYears = document.createElement("td");

  tDFIO.style = "cursor: pointer";
  tDFaculty.style = "cursor: pointer";
  tDBirthDate.style = "cursor: pointer";
  tDLearningYears.style = "cursor: pointer";

  tDFIO.innerHTML = "Ф.И.О.";
  tDFaculty.innerHTML = "Факультет";
  tDBirthDate.innerHTML = "Дата рождения (возраст)";
  tDLearningYears.innerHTML = "Годы обучения";

  tableHeadRow.style = "font-weight: bold";

  tableStudents.append(tableHeadRow);
  tableHeadRow.append(tDFIO, tDFaculty, tDBirthDate, tDLearningYears);

  function arrayToSorted() {
    tDFIO.addEventListener("click", () => {
      sortColFlag = "fullNameUser";
      sortDirFlag = !sortDirFlag;
      renderStudentsTable();
    });
    tDFaculty.addEventListener("click", () => {
      sortColFlag = "faculty";
      sortDirFlag = !sortDirFlag;
      renderStudentsTable();
    });
    tDBirthDate.addEventListener("click", () => {
      sortColFlag = "birthday";
      sortDirFlag = !sortDirFlag;
      renderStudentsTable();
    });
    tDLearningYears.addEventListener("click", () => {
      sortColFlag = "studyStart";
      sortDirFlag = !sortDirFlag;
      renderStudentsTable();
    });
  }
  arrayToSorted();
}

function getStudentItem(studentObj) {
  const tableRow = document.createElement("tr");
  const tableColFIO = document.createElement("td");
  const tableColFaculty = document.createElement("td");
  const tableColBirthDate = document.createElement("td");
  const tableColLearningYears = document.createElement("td");
  const tableColDeleteButton = document.createElement("td");
  const studentDeleteButton = document.createElement("button");
  studentDeleteButton.classList.add("btn", "btn-danger");
  studentDeleteButton.textContent = "Удалить";
  const userAge = getAge(studentObj.birthday);
  studentObj.fullNameUser = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;

  function getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const ageStr = age.toString();
    if (ageStr.endsWith("1")) {
      return `(${ageStr} год)`;
    }
    if (ageStr.endsWith("2")) {
      return `(${ageStr} года)`;
    }
    if (ageStr.endsWith("3")) {
      return `(${ageStr} года)`;
    }
    if (ageStr.endsWith("4")) {
      return `(${ageStr} года)`;
    }
    return `(${ageStr} лет)`;
  }

  function getCourseYear() {
    const currentDateCourse = new Date();
    let course = currentDateCourse.getFullYear() - studentObj.studyStart + 1;
    if (course > 4) {
      course = "Закончил";
      return course;
    }
    return `${course} курс`;
  }

  studentObj.birthday = new Date(studentObj.birthday);

  tableColFIO.innerHTML = studentObj.fullNameUser;
  tableColFaculty.innerHTML = studentObj.faculty;
  tableColBirthDate.innerHTML = `${studentObj.birthday.toLocaleDateString()} ${userAge}`;
  tableColLearningYears.innerHTML = `${studentObj.studyStart}-${
    parseInt(studentObj.studyStart) + 4
  } (${getCourseYear()})`;

  studentDeleteButton.addEventListener('click', async () => {
    await serverDeleteStudent(studentObj.id)
    tableRow.remove();
  })

  tableStudents.append(tableRow);
  tableColDeleteButton.append(studentDeleteButton);
  tableRow.append(
    tableColFIO,
    tableColFaculty,
    tableColBirthDate,
    tableColLearningYears,
    tableColDeleteButton
  );
}

function renderStudentsTable(studentsArray) {
  tableStudents.innerHTML = "";
  studentsArray = [...studentsList];
  studentsArray = studentsArray.sort((a, b) => {
    let sort = a[sortColFlag] < b[sortColFlag];
    if (sortDirFlag === false) sort = a[sortColFlag] > b[sortColFlag];
    return sort ? -1 : 1;
  });
  createTableHead();

  function filter(arr, prop, value) {
    return arr.filter((student) => {
      if (student[prop].toString().includes(value.trim())) return true;
    });
  }

  if (inputFIOFilter.value.trim() !== "") {
    studentsArray = filter(studentsArray, "fullNameUser", inputFIOFilter.value);
  }
  if (inputFacultyFilter.value.trim() !== "") {
    studentsArray = filter(studentsArray, "faculty", inputFacultyFilter.value);
  }
  if (inputBirthDateFilter.value.trim() !== "") {
    studentsArray = filter(
      studentsArray,
      "birthday",
      inputBirthDateFilter.value
    );
  }
  if (inputLearningYearsFilter.value.trim() !== "") {
    studentsArray = filter(
      studentsArray,
      "studyStart",
      inputLearningYearsFilter.value
    );
  }

  for (const student of studentsArray) {
    getStudentItem(student);
  }
}
renderStudentsTable();

studentAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let student = {
    surname: inputSurname.value.trim(),
    name: inputName.value.trim(),
    lastname: inputPatronymic.value.trim(),
    faculty: inputFaculty.value.trim(),
    birthday: new Date(inputBirthDate.value),
    studyStart: inputLearningYears.value.trim(),
  };

  inputsArray.forEach((input) => {
    input.value = "";
    studentAddButton.disabled = true;
  });
  let serverDataObj = await serverAddStudent(student);
  studentsList.push(serverDataObj);
  renderStudentsTable();
});

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
inputFIOFilter.addEventListener("input", () => {
  renderStudentsTable();
});
inputFacultyFilter.addEventListener("input", () => {
  renderStudentsTable();
});
inputBirthDateFilter.addEventListener("input", () => {
  renderStudentsTable();
});
inputLearningYearsFilter.addEventListener("input", () => {
  renderStudentsTable();
});
