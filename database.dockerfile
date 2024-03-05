# Utilisez l'image PostgreSQL officielle comme image de base
FROM postgres:lts

# Définissez l'utilisateur et le mot de passe par défaut pour la base de données
ENV POSTGRES_USER=sop_db_admin
ENV POSTGRES_PASSWORD=DB_S0UR3_0F_P0W3R
ENV POSTGRES_DB=sop_database

# Copiez les fichiers d'initialisation SQL dans le conteneur
COPY ressources/database/init.sql /docker-entrypoint-initdb.d/

# Exposez le port PostgreSQL (par défaut 5432)
EXPOSE 5432
