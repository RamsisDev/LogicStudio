namespace TransactionService.External
{
    public interface IProducto
    {
        int? ObtenerStockSync(int productoId);
        bool ActualizarStockSync(int productoId, int nuevoStock);
    }

    internal sealed class ProductoApiClient : IProducto
    {
        private readonly HttpClient _http;
        public ProductoApiClient(HttpClient http) => _http = http;

        public int? ObtenerStockSync(int productoId)
        {
            var resp = _http.GetAsync($"/Producto/{productoId}")
                            .GetAwaiter().GetResult();

            if (resp.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            resp.EnsureSuccessStatusCode();
            var producto = resp.Content.ReadFromJsonAsync<ProductoDto>()
                                       .GetAwaiter().GetResult();
            return producto?.Stock;
        }

        public bool ActualizarStockSync(int productoId, int nuevoStock)
        {
            var actual = ObtenerStockSync(productoId);
            if (actual is null) return false;

            var producto = new ProductoDto
            {
                Id = productoId,
                Nombre = string.Empty,
                Descripcion = string.Empty,
                Precio = 0,
                Stock = nuevoStock
            };

            var resp = _http.PutAsJsonAsync($"/ModificarStock/{productoId}/{nuevoStock}", producto)
                            .GetAwaiter().GetResult();
            return resp.IsSuccessStatusCode;
        }

        private sealed class ProductoDto
        {
            public int Id { get; set; }
            public string Nombre { get; set; } = default!;
            public string Descripcion { get; set; } = default!;
            public decimal Precio { get; set; }
            public int Stock { get; set; }
        }
    }
}
