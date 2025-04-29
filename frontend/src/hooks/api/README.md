
## 🌐 `useApi` – Hook de requêtes HTTP avec gestion de token

### 📌 Description rapide

Le hook `useApi` permet de faire des requêtes HTTP dans un composant React, avec :
- Support de `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Gestion automatique du token JWT via les cookies
- Relance automatique de la requête après refresh du token (via `/auth/refresh`)
- Lancement immédiat ou manuel configurable
- Retour de l'état (`loading`, `error`, `data`) et fonction `refetch`

---

### ✅ Exemple simple – Récupération de données

```tsx
import { useApi } from "./useApi";

function UsersList() {
  const { data, error, loading } = useApi<User[]>("/users", {
    method: "GET",
    onSuccess: (users) => console.log("Utilisateurs récupérés", users),
    onError: (err) => console.error("Erreur lors du fetch", err),
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;
  if (!data) return <p>Aucun utilisateur</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

---

### 🛠 Exemple avec POST (et envoi de token)

```tsx
const { data, loading, error, refetch } = useApi("/posts", {
  method: "POST",
  body: { title: "Mon article", content: "Contenu ici" },
  onSuccess: (result) => alert("Article créé !"),
  istoken: true, // ajoute automatiquement le token JWT
});
```

---

### 🔁 Exemple de déclenchement manuel (`immediate: false`)

```tsx
const { data, loading, refetch } = useApi("/search", {
  method: "POST",
  body: { query: "test" },
  immediate: false,
});

// Appel manuel
<button onClick={refetch}>Rechercher</button>
```

---

### 🧠 Notes
- Le `BASE_URL` est défini dans le fichier comme : `https://localhost:8443`
- Le token est automatiquement ajouté si `istoken` est `true` (par défaut)
- En cas de 401, le token est rafraîchi via `/auth/refresh` si possible
- En cas d’échec de refresh, redirection automatique vers `/`
