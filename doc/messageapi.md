### Structure d’un message de commit

Un commit suivant cette convention est structuré de la façon suivante :

**En-tête**
   Commence par le type suivi d’un deux-points et éventuellement d’un scope entre parenthèses.
   *Exemple :* `feat(auth): ajout de la fonctionnalité de double authentification`.
### ✅ **Format de réponse**

#### Succès (`2xx`)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Maxence"
    }
  }
}
```

#### Erreur (`4xx`, `5xx`)
```json
{
  "status": "error",
  "message": "Invalid credentials",
  "code": 401
}
```

---

### 🔐 **Authentification (si requise)**

- Par défaut : **JWT** via header
```
Authorization: Bearer <token>
```