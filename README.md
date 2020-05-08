
# Release notes generator
## Introduction

Cet outil en ligne de commande permet de générer des notes de release basées sur les données provenant de l'API GraphQL utilisée par le portail infonuagique. Avec cet outil on peut générer les notes de release en format Markdown et pousser les notes générées sur Confluence.

## Utilisation

### Avec fichier dotenv et les variables d'environnements

Le fichier dotenv doit dontenir les variables suivantes:
```
GRAPHQL_URL=<lien de l'API GraphQL>
CONFLUENCE_URL=<lien de confluence>
CONFLUENCE_USER=<nom d'utilisateur du compte de service confluence>
CONFLUENCE_PASSWORD=<mot de passe du compte de service confluence>
PRODUCT_TOKEN_URL=<lien du serveur OAuth>
PRODUCT_CLIENT_ID=<id du client>
PRODUCT_CLIENT_SECRET=<secret>
```

Commande
```
$ releasenotes-gen gen -t <version du release> \
  --space-key <space-key> \
  --project <nom du projet> \
  --repository <nom du repos dans Bitbucket> \
  --parent-page <nom de la page qui doit être parent des notes de release>
```

### Sans fichier dotenv
Commande
```
$ releasenotes-gen gen -t <version du release> \
  --space-key <space-key> \
  --project <nom du projet> \
  --repository <nom du repos dans Bitbucket> \
  --parent-page <nom de la page qui doit être parent des notes de release> \
  --graphql-url <graphql-url> \
  --confluence-url <confluence-url> \
  --confluence-username <confluence-username> \
  --confluence-password <confluence-password> \
  --product-token-url <product-token-url> \
  --product-client-id <product-client-id> \
  --product-client-secret <product-client-secret> 

```