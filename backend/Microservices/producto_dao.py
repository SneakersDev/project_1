import mysql.connector
from database import DatabaseConnection

class ProductoDAO:
    """Clase de acceso a datos para productos."""

    @staticmethod
    def obtener_productos():
        """Consulta todos los productos."""
        try:
            conexion = DatabaseConnection().get_connection()
            cursor = conexion.cursor(dictionary=True)
            cursor.callproc('obtenerProductos')
            for resultado in cursor.stored_results():
                productos = resultado.fetchall()
            return productos
        except Exception as e:
            print(f"❌ Error al obtener productos: {e}")
            return []

    @staticmethod
    def obtener_producto_por_id(product_id):
        """Obtiene un producto específico por su ID."""
        try:
            conexion = DatabaseConnection().get_connection()
            cursor = conexion.cursor(dictionary=True)
            cursor.callproc('getSneakersByID', [product_id])
            for resultado in cursor.stored_results():
                producto = resultado.fetchone()
            return producto
        except Exception as e:
            print(f"❌ Error al obtener producto por ID: {e}")
            return None
