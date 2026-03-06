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
    renderCell: (params) => <img src={params.row.thumbnail} alt="" />,
  },
  { field: "title", headerName: "Title", flex: 2, minWidth: 200 },
  { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
  { field: "brand", headerName: "Brand", flex: 1, minWidth: 150 },
  { field: "stock", headerName: "Stock", flex: 1, minWidth: 100 },
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
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["products"], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter((item) => String(item.id) !== String(variables));
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      return {
        ...newProduct,
        id: newId,
        thumbnail: newProduct.thumbnail || "/no-image.png",
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
      };
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["products"], (old: any[] | undefined) => {
        return [newData, ...(old || [])];
      });
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
        onDelete={(id: number | string) => deleteMutation.mutate(id)}
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