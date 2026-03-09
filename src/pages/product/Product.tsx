import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "../../services/queryService";
import Single from "../../components/single/Single";
import Update from "../../components/update/Update";
import { singleProduct } from "../../data";
import { GridColDef } from "@mui/x-data-grid";
import "./product.scss";

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", type: "string" },
  { field: "price", headerName: "Price", type: "number" },
  { field: "brand", headerName: "Brand", type: "string" },
  { field: "stock", headerName: "Stock", type: "number" },
];

const Product = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // const { data: product, isLoading } = useQuery({
  //   queryKey: ["product", id],
  //   queryFn: () => getProduct(Number(id)),
  //   enabled: !!id,
  //   staleTime: Infinity,
  // });

  const { data: product, isLoading } = useQuery({
  queryKey: ["product", id],
  queryFn: async () => {
    const productId = Number(id);
    
    if (productId > 30) {
      const allProducts = queryClient.getQueryData<any[]>(["products"]);
      const localProduct = allProducts?.find(p => Number(p.id) === productId);
      if (localProduct) return localProduct;
    }
    
    return await getProduct(productId);
  },
  enabled: !!id,
  staleTime: Infinity,
});

  const updateMutation = useMutation({
    mutationFn: async (data: any) => data,
    onSuccess: (data) => {
      queryClient.setQueryData(["product", id], (old: any) => ({ ...old, ...data }));
      queryClient.setQueryData(["products"], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map((p) => (p.id === Number(id) ? { ...p, ...data } : p));
      });
      setOpen(false);
    },
  });

  if (isLoading) return <div className="product">Loading...</div>;
  if (!product) return <div className="product">Product not found.</div>;

  const formattedProduct = {
    ...product,
    img: product.thumbnail || "/no-image.png",
    title: product.title,
    info: {
      Price: `$${product.price}`,
      Brand: product.brand,
      Stock: product.stock,
    },
    chart: singleProduct.chart,
    
  };

  return (
    <div className="product">
      <Single {...formattedProduct} onUpdate={() => setOpen(true)} />
      {open && (
        <Update
          slug="product"
          columns={columns}
          setOpen={setOpen}
          data={formattedProduct}
          onUpdate={(data) => updateMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Product;