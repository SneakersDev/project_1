#Usa el patrón Singleton para evitar múltiples conexiones a MySQL.
import mysql.connector
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')

load_dotenv(dotenv_path)

db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")
class DatabaseConnection:
    """Clase Singleton para manejar la conexión a MySQL."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance.connection = mysql.connector.connect(
                host=db_host,
                user=db_user,
                password=db_password,
                database=db_name
            )
        return cls._instance

    def get_connection(self):
        """Devuelve la conexión a la base de datos."""
        return self.connection
