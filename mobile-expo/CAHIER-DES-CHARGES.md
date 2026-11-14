# FaithLingo — cahier des charges fonctionnel

## 1. Vision et principes produit

FaithLingo est une application mobile d'apprentissage religieux et spirituel consacrée à la Bible et au Coran. Elle propose des séances courtes, accessibles et régulières, avec des parcours séparés et un parcours de découverte facultatif.

**Promesse :** apprendre à son rythme, comprendre les textes et revenir chaque jour sans pression ni compétition.

Principes non négociables :

- Présenter clairement la tradition, la traduction et la source de chaque contenu.
- Ne pas présenter une interprétation théologique comme un fait universel ; signaler les différences entre traditions lorsqu'elles sont pertinentes.
- Faire relire les contenus par des personnes compétentes et représentatives des traditions concernées.
- Ne pas utiliser de publicité intrusive, de mécanisme culpabilisant ou de classement public.
- Rendre les rappels, la série quotidienne et les mécaniques de jeu facultatifs.
- Vérifier les droits de reproduction des traductions, commentaires et enregistrements avant toute diffusion.

## 2. Architecture de l'information

### Navigation principale

1. **Accueil / Parcours** — objectif du jour, progression du parcours, reprise de la prochaine leçon et accès aux révisions.
2. **Explorer** — parcours Bible, parcours Coran et parcours Découverte, avec niveau, durée et sources affichés avant l'inscription.
3. **Réviser** — textes et notions déjà étudiés, réécoute et méditation sans chronomètre ni score.
4. **Progression** — leçons terminées, XP, série et objectif personnel ; statistiques privées et désactivables.
5. **Profil et réglages** — tradition et niveau choisis, objectif quotidien, rappels, accessibilité, confidentialité, gestion des données et aide.

### Écrans et parcours

| Écran | Fonction principale |
|---|---|
| Bienvenue | Présenter la promesse, les traditions proposées et les principes de respect. |
| Choix du parcours | Choisir Bible, Coran ou Découverte ; expliquer ce que couvre chaque choix. |
| Niveau | Débutant, intermédiaire ou avancé, avec possibilité de modifier plus tard. |
| Objectif quotidien | 5, 10 ou 15 minutes ; préciser que l'objectif est modifiable et sans pénalité. |
| Rappels | Choisir une heure, activer ou ignorer les notifications. |
| Accueil | Afficher la prochaine étape et une action claire pour commencer ou reprendre. |
| Carte du parcours | Parcours organisé en modules et étapes ; les contenus verrouillés indiquent comment les débloquer. |
| Leçon | Exercices progressifs, explication, source consultable, audio facultatif et progression accessible. |
| Résultat | Résumé bienveillant, points éventuellement gagnés et proposition de continuer ou de réviser. |
| Révision / méditation | Lecture ou écoute libre, sans temps limité, vies, score ni notification de fin. |
| Progression | Série, XP et modules terminés ; options de masquage et absence de classement public. |
| Réglages | Préférences de parcours, notifications, taille du texte, contraste, audio et suppression/export des données. |

### Onboarding

1. Accueil et présentation des règles de respect du contenu.
2. Choix du parcours : Bible, Coran ou Découverte.
3. Choix du niveau : débutant, intermédiaire ou avancé.
4. Choix de l'objectif : 5, 10 ou 15 minutes par jour.
5. Proposition d'un rappel configurable ou ignoré.
6. Arrivée sur l'accueil avec une première leçon recommandée et possibilité de modifier les choix.

L'inscription à un compte ne doit pas être imposée avant la découverte des parcours. Si un compte est nécessaire pour synchroniser la progression, l'application l'explique au moment opportun.

## 3. Progression et mécaniques de jeu

- **Arbre de progression :** modules thématiques composés de leçons courtes. L'ordre recommandé est visible ; les prérequis sont expliqués.
- **XP :** récompense de participation et de régularité, sans comparer la foi, la connaissance ou la valeur des personnes.
- **Série :** indique les jours d'apprentissage selon l'heure locale. L'utilisateur peut la masquer, la mettre en pause ou désactiver son suivi.
- **Gel de série :** option non obligatoire, gagnée ou configurée sans pénalité en cas d'absence. Ne pas pousser à l'achat sous pression.
- **Cœurs / énergie :** ne pas bloquer l'accès aux textes ou à la méditation. Si des essais sont limités dans un exercice ludique, proposer une correction et une révision sans sanction.
- **Révision espacée :** proposer de revoir les notions difficiles à intervalles adaptés, sans transformer le contenu sacré en compétition.
- **Réussite :** encouragement contextualisé et possibilité de comprendre une erreur avant de poursuivre.

## 4. Exercices et exigences fonctionnelles

- **Texte à trous :** compléter une citation ou une notion. Afficher la référence et la traduction exacte, sans découper un passage de manière trompeuse.
- **Association :** relier un passage à sa traduction, son thème ou une explication sourcée.
- **Écoute :** écouter un enregistrement autorisé et répondre à une question de compréhension. La récitation ou lecture n'est pas notée automatiquement dans la première version.
- **Vrai / faux :** questions sur un contexte explicitement sourcé ; distinguer faits historiques, traditions et interprétations.
- **Ordonnancement :** remettre en ordre des étapes d'un récit ou d'une notion, avec indication de la source.
- **Révision libre :** lire, écouter, mettre en favori et reprendre sans score ni limite de temps.

Chaque leçon comprend un objectif, une durée estimée, les exercices, une explication de fin et une référence vérifiable.

## 5. Plan de contenu — Module 1 Bible

**Module :** Repères fondateurs — récit, alliance et espérance.  
**Niveau cible :** débutant. **Durée :** 5 à 8 minutes par leçon.  
Les références ci-dessous indiquent des passages à étudier ; le texte final et les questions doivent être validés par un comité éditorial interconfessionnel.

| Leçon | Sujet et références de travail | Activités proposées | Objectif |
|---|---|---|---|
| 1. Lire la Bible | Organisation générale : Ancien et Nouveau Testament ; genres littéraires et repères de lecture. | Associer quelques genres à leur description ; quiz sur la structure. | Se repérer dans l'ouvrage sans confondre récit, poésie et lettre. |
| 2. La création | Genèse 1–2. | Remettre en ordre des étapes du récit ; associer un thème à un passage. | Identifier les thèmes du récit et comprendre qu'il existe différentes lectures. |
| 3. Abraham et la promesse | Genèse 12 et 15. | Texte à trous sur une notion clé, avec citation exacte après validation ; question de compréhension. | Situer Abraham dans le récit et reconnaître le thème de la promesse. |
| 4. Moïse et la libération | Exode 3 et 12–14. | Associer personnages, événements et références ; quiz de contexte. | Retenir les grandes étapes du récit et distinguer texte et interprétation. |
| 5. Les Béatitudes | Matthieu 5, 1–12. | Associer une béatitude à son thème ; révision méditative sans score. | Découvrir un enseignement du Nouveau Testament et réfléchir à son vocabulaire. |

**Sources à évaluer et licencier :** texte biblique dans une traduction francophone choisie avec conseil éditorial (par exemple Louis Segond ou Crampon, selon les droits applicables), références de chapitres et versets, notes éditoriales et audio dont les droits sont documentés.

## 6. Plan de contenu — Module 1 Coran

**Module :** Premiers repères — lecture, récitation et thèmes essentiels.  
**Niveau cible :** débutant. **Durée :** 5 à 8 minutes par leçon.  
Les sourates et thèmes sont des références de travail ; toute traduction, translittération, explication et règle de récitation doit être validée par des spécialistes compétents.

| Leçon | Sujet et références de travail | Activités proposées | Objectif |
|---|---|---|---|
| 1. Découvrir le Coran | Organisation en sourates et versets ; place de la traduction et de la récitation. | Associer vocabulaire de base à une définition validée ; repérage dans une table des sourates. | Comprendre les conventions de lecture sans présenter une traduction comme l'original arabe. |
| 2. Al-Fatiha | Sourate 1. | Écoute d'une récitation autorisée ; association de thèmes à une traduction retenue. | Se familiariser avec la sourate et sa place dans la prière, avec validation éditoriale. |
| 3. Le sens d'Al-Ikhlas | Sourate 112. | Écoute et compréhension ; question à choix avec référence de traduction. | Identifier le thème central selon une explication relue par des personnes qualifiées. |
| 4. Marie et Jésus dans le Coran | Sourate 19, passages sélectionnés à valider. | Retrouver un passage dans la référence ; distinguer citation, traduction et commentaire. | Découvrir le récit dans le cadre coranique avec un ton neutre et sourcé. |
| 5. Le récit de Joseph | Sourate 12, passages sélectionnés à valider. | Remettre en ordre des épisodes ; quiz de compréhension sans jugement théologique. | Retenir les étapes d'un récit et les thèmes que les sources éditoriales y associent. |

**Sources à évaluer et licencier :** traduction francophone agréée ou choisie par le comité éditorial, texte arabe fiable, règles de translittération, tafsir identifié et contextualisé, enregistrements de récitateurs certifiés avec autorisations explicites.

## 7. Charte UX et visuelle

### Ton et interactions

- Bienveillant, calme, précis et non prescriptif.
- Dire « À revoir » plutôt que « Échec » ; expliquer les réponses et inviter à recommencer sans perdre de progression.
- Ne pas personnifier ni caricaturer les figures religieuses.
- Distinguer visuellement texte source, traduction, explication éditoriale et contenu communautaire éventuel.
- Éviter les animations festives sur les textes sacrés ; réserver les retours visuels ludiques à la progression et aux contrôles.
- Prévoir une expérience entièrement utilisable sans son et une lecture audio facultative.

### Direction artistique

- Interface lumineuse et apaisante, avec fonds ivoire ou sable, texte encre profonde et accent végétal/bleu nuit.
- Une palette distincte mais cohérente par parcours, sans associer une tradition à une valeur morale supérieure.
- Typographie très lisible ; police adaptée à l'arabe pour le parcours Coran, prise en charge du sens droite-à-gauche et des signes diacritiques.
- Illustrations abstraites ou géométriques sobres ; éviter les représentations controversées des figures religieuses.
- Cartes de parcours aérées, progression compréhensible et boutons assez grands pour une utilisation au pouce.
- Animations courtes, désactivables et respectueuses des préférences de réduction du mouvement.

### Accessibilité et confidentialité

- Contraste conforme aux recommandations WCAG, taille de texte adaptable, zones tactiles confortables et compatibilité lecteur d'écran.
- Sous-titres ou transcription des contenus audio ; commandes de lecture accessibles.
- Parcours utilisable avec faible débit et reprise d'une leçon interrompue.
- Collecter uniquement les données nécessaires ; expliquer stockage, synchronisation, suppression et notifications.
- Ne jamais afficher publiquement la tradition, la progression ou les habitudes religieuses sans action explicite.

## 8. Stack technique recommandée

### Application mobile

- **React Native avec Expo et TypeScript** : partage de code iOS/Android, itération rapide et écosystème adapté à une application mobile.
- **Expo Router** pour les routes et la navigation, avec séparation claire entre écrans, composants et logique métier.
- **Stockage local** pour préférences et progression hors ligne, avec une stratégie de synchronisation explicite si un compte est activé.
- Audio via les modules Expo compatibles avec la version de SDK retenue ; valider en amont l'enregistrement, la lecture en arrière-plan et les politiques iOS/Android.

### Backend et données

- **Supabase (PostgreSQL, Auth, Storage, Row Level Security)** est recommandé pour authentification, progression synchronisée, contenu éditorial et médias autorisés.
- Un backend API dédié reste une alternative si les règles éditoriales, licences ou traitements audio nécessitent une couche métier plus forte.
- Modéliser séparément parcours, modules, leçons, exercices, références, traductions, licences, versions et progression utilisateur.
- Les données de progression et de profil doivent être privées par défaut, protégées par des règles d'accès testées.

### Services et qualité

- Notifications locales pour rappels configurables ; notifications distantes seulement si une nécessité produit est démontrée et avec consentement.
- Analytics respectueux de la vie privée, désactivables et sans collecte de contenu religieux sensible.
- CI pour tests, vérification TypeScript, lint et builds iOS/Android ; distribution de test avant publication.
- Documenter les droits d'auteur des traductions et audios, les politiques de conservation des données et les procédures de correction éditoriale.

## 9. Périmètre recommandé pour le MVP

1. Onboarding avec choix d'un parcours, niveau, objectif et rappels facultatifs.
2. Un module initial par parcours, avec cinq leçons courtes et références vérifiables.
3. Exercices de compréhension, association, texte à trous et écoute de contenu autorisé.
4. Progression locale, révision libre et réglages d'accessibilité essentiels.
5. Synchronisation de compte uniquement après validation des règles de confidentialité et de la stack backend.

À exclure de la première version : classement public, publicité, notation automatique de récitation, commentaires communautaires non modérés, conseils religieux personnalisés et toute affirmation doctrinale non relue.

## 10. Points à valider avant production

- Nom de marque définitif et disponibilité juridique.
- Comité éditorial et méthode de validation pour chaque tradition.
- Traductions, commentaires, audio et licences exactes.
- Pays de lancement, langues et règles de protection des données applicables.
- Nécessité d'un compte et choix final entre Supabase et backend dédié.
- Politique de notifications, synchronisation hors ligne et suppression/export des données.
