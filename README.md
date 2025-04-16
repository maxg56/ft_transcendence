# ft_transcendence
por la production
-  NODE_ENV=production 
- CMD ["npm", "run", "start"].
reverse_proxy /* frontend:5173

### Types de commit

- **feat**
  Utilisé pour introduire une nouvelle fonctionnalité dans le code.
  *Exemple :* `feat(auth): ajout de la connexion via OAuth`.

- **fix**
  Sert à corriger un bug ou un comportement inattendu.
  *Exemple :* `fix(form): correction d'une erreur de validation`.

- **docs**
  Changements liés à la documentation. Cela peut inclure la mise à jour ou l’ajout de documents, sans modification du code source.
  *Exemple :* `docs(readme): mise à jour de la procédure d'installation`.

- **style**
  Modifications relatives à la mise en forme du code (indentation, espaces, ponctuation, etc.) qui n'affectent pas la logique ou le comportement du code.
  *Exemple :* `style: reformattage du code selon les normes de linting`.

- **refactor**
  Modifications du code qui n’ajoutent pas de fonctionnalité ni ne corrigent de bug, mais qui améliorent la structure ou la lisibilité du code.
  *Exemple :* `refactor: simplification de la logique d'authentification`.

- **perf**
  Changements destinés à améliorer les performances du logiciel sans modifier son comportement observable.
  *Exemple :* `perf: optimisation de l'algorithme de traitement des données`.

- **test**
  Tout ajout ou modification dans les tests, qu'il s'agisse de tests unitaires, d'intégration ou autres.
  *Exemple :* `test: ajout de tests pour la fonction de calcul`.

- **build**
  Changements qui affectent le système de build ou les dépendances externes (configuration de Maven, Gradle, npm, etc.).
  *Exemple :* `build: mise à jour de la version de Node.js dans le package.json`.

- **ci**
  Modifications portant sur l'intégration continue ou les scripts de déploiement.
  *Exemple :* `ci: correction du script de déploiement sur le serveur de test`.

- **chore**
  Modifications de tâches de maintenance, de configurations diverses ou d'autres changements qui ne touchent pas directement au code source (mise à jour des outils, tâches d'automatisation, etc.).
  *Exemple :* `chore: nettoyage des fichiers temporaires après build`.

- **revert**
  Utilisé pour annuler un commit précédent.
  *Exemple :* `revert: retour sur le commit [hash] à cause de problèmes de performance`.

### Structure d’un message de commit

Un commit suivant cette convention est structuré de la façon suivante :

**En-tête**
   Commence par le type suivi d’un deux-points et éventuellement d’un scope entre parenthèses.
   *Exemple :* `feat(auth): ajout de la fonctionnalité de double authentification`.
