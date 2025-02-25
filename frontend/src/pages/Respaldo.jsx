const Respaldo = () =>{
    return(
        <div>
                            <h1>{t("dashboard.title")}</h1>
                {user && (
                    <p>
                        {t("dashboard.user")}: {user.displayName || user.email}
                    </p>
                )}
                <button onClick={handleLogout} className="btn btn-danger">
                    {t("dashboard.logout")}
                </button>
                <div className="row mt-4">
                    {/* Menú lateral para filtros */}
                    <div className="col-md-3">
                        <h4>Categorías</h4>
                        <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Todas</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <h4 className="mt-4">Marcas</h4>
                        <select className="form-control" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Todas</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Tarjetas para mostrar los sneakers */}
                    <div className="col-md-9">
                        <div className="grid-container">
                            {sneakers && sneakers.length > 0 ? (
                                sneakers.map((sneaker) => (
                                    <div key={sneaker.nombre} className="card">
                                        {sneaker.imagen && <img src={sneaker.imagen} alt={sneaker.nombre} className="card-img" />}
                                        <div className="card-info">
                                            <h3>{sneaker.nombre}</h3>
                                            <p>{sneaker.descripcion}</p>
                                            <p>
                                                <strong>Categoría:</strong> {sneaker.categoria}
                                            </p>
                                            <p>
                                                <strong>Marca:</strong> {sneaker.marca}
                                            </p>
                                            <p>
                                                <strong>Modelo:</strong> {sneaker.modelo}
                                            </p>
                                            {sneaker.precio && <p className="price">${sneaker.precio}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-results text-center">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    )
}