document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    const detailsContainer = document.getElementById('detailsContainer');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const course = document.getElementById('course').value;

        if (name && email && age && gender && course) {
            successMessage.textContent = `Thank you, ${name}! You have successfully registered for ${course}.`;
            successMessage.style.display = 'block';
            form.reset();
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    showDetailsBtn.addEventListener('click', function () {
        fetch('src/scripts/data.json')
            .then(response => response.json())
            .then(data => {
                let html = '<table class="table table-bordered"><thead><tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Course</th></tr></thead><tbody>';
                data.forEach(student => {
                    html += `<tr>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.age}</td>
                        <td>${student.gender}</td>
                        <td>${student.course}</td>
                    </tr>`;
                });
                html += '</tbody></table>';
                detailsContainer.innerHTML = html;
            })
            .catch(error => {
                detailsContainer.innerHTML = '<p class="text-danger">Could not load details.</p>';
            });
    });
});