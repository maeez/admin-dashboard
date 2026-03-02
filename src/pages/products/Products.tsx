import { useState } from "react";
import "./products.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProducts,
  deleteProduct,
  createProduct,
} from "../../services/productService";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "thumbnail",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.thumbnail} alt="" />;
    },
  },
  {
    field: "title",
    headerName: "Title",
    width: 250,
  },
  {
    field: "price",
    headerName: "Price",
    width: 150,
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 200,
  },
  {
    field: "stock",
    headerName: "Stock",
    width: 120,
  },
];

const Products = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setOpen(true)}>Add New Product</button>
      </div>

      <DataTable
        slug="products"
        columns={columns}
        rows={products || []}
        onDelete={(id: number) => deleteMutation.mutate(id)}
      />

      {open && (
        <Add
          slug="product"
          columns={columns}
          setOpen={setOpen}
          onAdd={(data) => createMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Products;