from flask import Flask, request, jsonify
from transformers import pipeline
from producto_dao import ProductoDAO

app = Flask(__name__)

# Cargar modelo de QA
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad", max_answer_length=50)

print("✅ Modelo de QA cargado.")

def obtener_producto(product_id):
    """Obtiene los datos del producto desde la base de datos."""
    return ProductoDAO.obtener_producto_por_id(product_id)

@app.route("/chat", methods=["POST"])
def chat():
    """Procesa la pregunta del usuario con el contexto del producto."""
    datos = request.get_json()
    pregunta = datos.get("pregunta", "").lower()  # Convertir la pregunta a minúsculas para mejor detección
    product_id = datos.get("product_id", None)
    print(f"📥 Datos recibidos: {datos}")

    if not product_id:
        return jsonify({"error": "Falta el ID del producto."}), 400

    producto = obtener_producto(product_id)

    if not producto:
        return jsonify({"error": "No se encontró información sobre este producto."}), 404

    # Responder directamente sin usar el modelo de QA
    if "nombre" in pregunta:
        return jsonify({"respuesta": producto.get("nombre", "Nombre no disponible")})
    
    if "precio" in pregunta:
        return jsonify({"respuesta": f"{producto.get('precio', 'Precio no disponible')} USD"})

    # Construir el contexto con nombre, descripción y precio
    contexto = f"Nombre: {producto.get('nombre', 'No disponible')}. " \
               f"Descripción: {producto.get('descripcion', 'No disponible')}. "

    print(f"🔍 Contexto utilizado: {contexto}")

    # Usar el modelo de QA para preguntas más complejas
    respuesta = qa_pipeline({"question": pregunta, "context": contexto})

    return jsonify({"respuesta": respuesta["answer"]})

if __name__ == "__main__":
    print("🚀 Chatbot Service iniciado en http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
