document.addEventListener('DOMContentLoaded', function() {
    // Generic Modal Handling
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');

    // Function to open a modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    };

    // Function to close a modal
    const closeModal = (modal) => {
        modal.classList.add('hidden');
    };
    
    // Open modal event listeners
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            const form = document.getElementById(modalId)?.querySelector('form');
            if(form) {
                form.reset();
                form.querySelector('input[name="id"]').value = ''; // Clear ID for "Add"
                 // Change form title and button text for "Add"
                form.querySelector('.modal-title').textContent = button.dataset.addTitle || 'Agregar';
                form.querySelector('button[type="submit"]').textContent = 'Guardar';
            }

            // For edit buttons
            if (button.dataset.editData) {
                const data = JSON.parse(button.dataset.editData);
                if (form) {
                    // Change form title and button text for "Edit"
                    form.querySelector('.modal-title').textContent = button.dataset.editTitle || 'Editar';
                    form.querySelector('button[type="submit"]').textContent = 'Actualizar';

                    // Populate form fields
                    for (const key in data) {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input) {
                            input.value = data[key];
                        }
                    }
                }
            }
            openModal(modalId);
        });
    });

    // Close modal event listeners
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal when clicking outside of it
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Confirmation for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const message = button.dataset.confirmMessage || '¿Está seguro de que desea eliminar este registro?';
            if (!confirm(message)) {
                event.preventDefault();
            }
        });
    });
});
