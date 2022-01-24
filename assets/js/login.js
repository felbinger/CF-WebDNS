document.getElementById('login').addEventListener('click', async e => {
    e.preventDefault();
    let token = document.getElementById('token').value;
    if (token.length > 35 && await isTokenValid(token)) {
        let storage = window.sessionStorage;
        storage.setItem('token', token);
        window.location = "index.html"
    } else {
        document.getElementById('loginError').outerHTML = `
            <div class="form-group">
                <div class="alert alert-danger">
                    <span class="fa fa-info-circle"></span>
                    Invalid Token!
                </div>
            </div>`;
    }
});