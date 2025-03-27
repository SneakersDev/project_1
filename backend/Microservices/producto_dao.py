import mysql.connector
from database import DatabaseConnection

class ProductoDAO:
    """Clase de acceso a datos para productos."""

    @staticmethod
    def obtener_producto_por_id(product_id):
        """Obtiene un producto específico por su ID."""
        try:
            conexion = DatabaseConnection().get_connection()
            cursor = conexion.cursor(dictionary=True)
            cursor.callproc("getSneakersByID", [product_id])
            for result in cursor.stored_results():
                producto = result.fetchone()
                return producto
        except Exception as e:
            print(f"❌ Error al obtener producto por ID: {e}")
            return None
