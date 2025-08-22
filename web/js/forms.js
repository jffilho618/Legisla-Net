/* forms.js */
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileNameEl = document.getElementById('file-name');
            if (fileNameEl) {
                fileNameEl.textContent = this.files[0] ? this.files[0].name : 'Nenhum arquivo selecionado.';
            }
        });
    }
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return; // Se o input não existir, não faz nada

    const button = input.closest('.password-group').querySelector('.password-toggle-btn, .password-toggle');
    if (!button) return; // Se o botão não existir, não faz nada

    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}