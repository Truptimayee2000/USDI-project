import os
from app import app
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool

POSTGRES_URL="localhost"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="Trupti"
POSTGRES_DB="usdi"
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PASSWORD,url=POSTGRES_URL,db=POSTGRES_DB)
app.config['SQLALCHEMY_DATABASE_URI']=DB_URL
app.config['SQLALCHEMY_Track_MODIFICATION']=False
app.config['SQLALCHEMY_ENGINE_OPTIONS']={'poolclass':NullPool}
# app.secret_key = "trupti"
db=  SQLAlchemy(app)

    
   

# engine_container = db.get_engine(app)   