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