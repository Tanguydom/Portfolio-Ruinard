// Fonction pour basculer l'affichage du menu hamburger
function toggleMenu() {
  const menu = document.querySelector('.navbar-menu-container');
  menu.classList.toggle('open'); // Ajoute/enlève la classe "open" pour afficher/cacher le menu
}

// Charge un composant dynamique dans le conteneur principal
function loadComponent(component) {
  const content = document.getElementById('content');
  fetch(`src/Pages/${component}/${component}.html`)
      .then(response => response.text())
      .then(html => {
          content.innerHTML = html;

          // Charger le CSS spécifique au composant
          const existingStylesheet = document.getElementById('dynamic-css');
          if (existingStylesheet) existingStylesheet.remove();
          const stylesheet = document.createElement('link');
          stylesheet.rel = 'stylesheet';
          stylesheet.href = `src/Pages/${component}/${component}.css`;
          stylesheet.id = 'dynamic-css';
          document.head.appendChild(stylesheet);
      })
      .catch(err => console.error(`Erreur lors du chargement du composant ${component}:`, err));
}


// Gestion des clics sur les éléments ayant un attribut "data-component"
document.querySelectorAll('[data-component]').forEach(element => {
  element.addEventListener('click', event => {
    event.preventDefault(); // Empêche le rechargement de la page
    const component = element.getAttribute('data-component');
    loadComponent(component); // Charge le composant correspondant
  });
});

// Charge automatiquement le composant "Home" au démarrage
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('home');
});


document.addEventListener('DOMContentLoaded', () => {
  console.log('home.js chargé et exécuté.');

  const modalContainer = document.createElement('div'); // Crée un conteneur pour la modale
  modalContainer.id = 'verification-modal-container';
  document.body.appendChild(modalContainer);

  // Vérifie si l'utilisateur a déjà validé son âge
  if (!localStorage.getItem('ageVerified')) {
    console.log('L\'âge n\'a pas encore été vérifié. Chargement de la modale...');

    // Charge le contenu de verification.html
    fetch('./src/Verification/verification.html')
      .then(response => {
        console.log('Statut du chargement:', response.status); // Vérifie le statut HTTP
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        console.log('Contenu HTML chargé avec succès.');
        modalContainer.innerHTML = html; // Injecte le contenu HTML

        // Ajoute le fichier CSS de la modale
        const modalStylesheet = document.createElement('link');
        modalStylesheet.rel = 'stylesheet';
        modalStylesheet.href = './src/Verification/verification.css'; // Chemin vers verification.css
        modalStylesheet.id = 'verification-css';

        modalStylesheet.onload = () => console.log('CSS chargé avec succès.');
        modalStylesheet.onerror = () => console.error('Erreur lors du chargement du CSS.');

        document.head.appendChild(modalStylesheet);

        // Vérifie si la modale a été ajoutée correctement
        const modal = document.getElementById('age-verification-modal');
        if (modal) {
          console.log('Modale ajoutée avec succès au DOM.');
          modal.style.display = 'flex';

          // Ajoute un gestionnaire d'événement pour le bouton Validate
          const validateButton = modal.querySelector('.validate-button');
          const yearInput = modal.querySelector('#year'); // Champ pour l'année de naissance
          const errorMessage = document.createElement('p'); // Message d'erreur
          errorMessage.style.color = 'red';
          errorMessage.style.fontSize = '12px';
          errorMessage.style.marginTop = '10px';
          errorMessage.style.display = 'none'; // Caché par défaut
          modal.querySelector('#age-verification-form').appendChild(errorMessage);

          if (validateButton) {
            validateButton.addEventListener('click', (e) => {
              e.preventDefault(); // Empêche le comportement par défaut
              console.log('Bouton Validate cliqué.');

              // Validation du champ d'année de naissance
              const yearValue = yearInput.value;
              const currentYear = new Date().getFullYear();

              if (!yearValue || isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear) {
                errorMessage.textContent = 'Veuillez entrer une année de naissance valide.';
                errorMessage.style.display = 'block';
              } else {
                errorMessage.style.display = 'none';
                localStorage.setItem('ageVerified', 'true'); // Enregistre la validation
                modal.style.display = 'none'; // Cache la modale
              }
            });
          } else {
            console.error('Bouton Validate non trouvé.');
          }
        } else {
          console.error('La modale n\'a pas été ajoutée au DOM.');
        }
      })
      .catch(err => console.error('Erreur lors du chargement:', err));
  } else {
    console.log('L\'utilisateur a déjà vérifié son âge.');
  }
});
