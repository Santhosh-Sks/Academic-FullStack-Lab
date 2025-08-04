document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // prevent actual form submission
    const email = document.getElementById('email').value;
    const rollno = document.getElementById('rollno').value;

    if (email && rollno) {
      alert(" Registered Successfully!");
      this.reset(); 
    }
  });