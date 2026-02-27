import { useState } from "react";
import "./products.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { products } from "../../data";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "title",
    type: "string",
    headerName: "Title",
    width: 250,
  },
  {
    field: "color",
    type: "string",
    headerName: "Color",
    width: 150,
  },
  {
    field: "price",
    type: "string",
    headerName: "Price",
    width: 200,
  },
  {
    field: "producer",
    headerName: "Producer",
    type: "string",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "inStock",
    headerName: "In Stock",
    width: 150,
    type: "boolean",
  },
];

const Products = () => {
  const [open, setOpen] = useState(false);
  const [productList, setProductList] = useState<any[]>(products);

  const handleAddProduct = (newProductData: Record<string, unknown>) => {
    const newProduct: any = {
      id: Math.max(...productList.map(p => p.id as number), 0) + 1,
      img: "",
      ...newProductData,
    };
    setProductList([...productList, newProduct]);
    setOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProductList(productList.filter(product => product.id !== id));
  };

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setOpen(true)}>Add New Product</button>
      </div>
      <DataTable slug="products" columns={columns} rows={productList} onDelete={handleDeleteProduct} />
      {open && <Add slug="product" columns={columns} setOpen={setOpen} onAdd={handleAddProduct} />}
    </div>
  );
};

export default Products;
