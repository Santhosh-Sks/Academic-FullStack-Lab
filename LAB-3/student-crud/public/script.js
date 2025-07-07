fetch('/students')
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById('studentTable');
    data.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.course}</td>
        <td>${s.age}</td>
        <td>
          <button onclick="edit('${s._id}', '${s.name}', '${s.email}', '${s.course}', ${s.age})">Edit</button>
          <button onclick="remove('${s._id}')">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  });

function edit(id, name, email, course, age) {
  document.getElementById('updateId').value = id;
  document.getElementById('updateName').value = name;
  document.getElementById('updateEmail').value = email;
  document.getElementById('updateCourse').value = course;
  document.getElementById('updateAge').value = age;
}

function remove(id) {
  fetch(`/students/${id}`, { method: 'DELETE' })
    .then(() => location.reload());
}

document.getElementById('updateForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('updateId').value;
  const updated = {
    name: document.getElementById('updateName').value,
    email: document.getElementById('updateEmail').value,
    course: document.getElementById('updateCourse').value,
    age: document.getElementById('updateAge').value
  };
  fetch(`/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  }).then(() => location.reload());
});
