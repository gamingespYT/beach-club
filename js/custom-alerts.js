// Sistema de alertas personalizadas Beach Club
(function () {
    'use strict';

    // Crear modal personalizado
    function createCustomModal(title, message, type = 'alert', onConfirm = null, onCancel = null) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'bc-modal-overlay';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'bc-modal';

        // Icono según tipo
        let icon = '🔔';
        let iconColor = '#FF7F50';
        if (type === 'confirm') {
            icon = '❓';
            iconColor = '#FFD700';
        } else if (type === 'success') {
            icon = '✅';
            iconColor = '#1abc9c';
        } else if (type === 'error') {
            icon = '❌';
            iconColor = '#e74c3c';
        }

        // Contenido del modal
        modal.innerHTML = `
      <div class="bc-modal-header">
        <span class="bc-modal-icon" style="color: ${iconColor}">${icon}</span>
        <h3 class="bc-modal-title">${title}</h3>
      </div>
      <div class="bc-modal-body">
        <p>${message}</p>
      </div>
      <div class="bc-modal-footer">
        ${type === 'confirm'
                ? '<button class="bc-btn bc-btn-cancel" data-action="cancel">Cancelar</button><button class="bc-btn bc-btn-confirm" data-action="confirm">Aceptar</button>'
                : '<button class="bc-btn bc-btn-confirm" data-action="ok">Aceptar</button>'
            }
      </div>
    `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animar entrada
        setTimeout(() => {
            overlay.classList.add('show');
            modal.classList.add('show');
        }, 10);

        // Función para cerrar
        function closeModal(result) {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
            return result;
        }

        // Event listeners
        modal.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'confirm' || action === 'ok') {
                    if (onConfirm) onConfirm();
                    closeModal(true);
                } else {
                    if (onCancel) onCancel();
                    closeModal(false);
                }
            });
        });

        // Cerrar con ESC
        function handleEscape(e) {
            if (e.key === 'Escape') {
                if (onCancel) onCancel();
                closeModal(false);
                document.removeEventListener('keydown', handleEscape);
            }
        }
        document.addEventListener('keydown', handleEscape);
    }

    // Funciones globales
    window.customAlert = function (message, title = '🏖️ Beach Club') {
        return new Promise((resolve) => {
            createCustomModal(title, message, 'alert', () => resolve(true));
        });
    };

    window.customConfirm = function (message, title = '🏖️ Beach Club') {
        return new Promise((resolve) => {
            createCustomModal(title, message, 'confirm',
                () => resolve(true),
                () => resolve(false)
            );
        });
    };

    window.customSuccess = function (message, title = '✅ Éxito') {
        return new Promise((resolve) => {
            createCustomModal(title, message, 'success', () => resolve(true));
        });
    };

    window.customError = function (message, title = '❌ Error') {
        return new Promise((resolve) => {
            createCustomModal(title, message, 'error', () => resolve(true));
        });
    };

    // Agregar estilos CSS
    const styles = `
    .bc-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .bc-modal-overlay.show {
      opacity: 1;
    }
    
    .bc-modal {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 450px;
      width: 90%;
      overflow: hidden;
      transform: scale(0.9) translateY(-20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .bc-modal.show {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    
    .bc-modal-header {
      background: linear-gradient(135deg, #87CEEB 0%, #FF7F50 100%);
      padding: 24px;
      text-align: center;
      color: white;
    }
    
    .bc-modal-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 12px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    
    .bc-modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .bc-modal-body {
      padding: 30px 24px;
      font-size: 1.1rem;
      color: #2c3e50;
      line-height: 1.6;
      text-align: center;
    }
    
    .bc-modal-footer {
      padding: 20px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .bc-btn {
      padding: 12px 32px;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Montserrat', sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .bc-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    
    .bc-btn:active {
      transform: translateY(0);
    }
    
    .bc-btn-confirm {
      background: linear-gradient(135deg, #FF7F50 0%, #FFD700 100%);
      color: white;
    }
    
    .bc-btn-confirm:hover {
      background: linear-gradient(135deg, #ff6a39 0%, #ffcc00 100%);
    }
    
    .bc-btn-cancel {
      background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
      color: white;
    }
    
    .bc-btn-cancel:hover {
      background: linear-gradient(135deg, #7f8c8d 0%, #6c7a7b 100%);
    }
  `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();
