import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./inventory.scss";

const mockInventory = [
  { id: 1, title: "Playstation 5 Digital Edition", category: "Gaming", stock: 24, price: 250.99, producer: "Sony" },
  { id: 2, title: "Dell Laptop KR211822", category: "Computers", stock: 8, price: 499.99, producer: "Dell" },
  { id: 3, title: "Samsung TV 4K SmartTV", category: "Electronics", stock: 5, price: 999.49, producer: "Samsung" },
  { id: 4, title: "Apple iPhone 14 Pro Max", category: "Phones", stock: 17, price: 799.49, producer: "Apple" },
  { id: 5, title: "Philips Hue Play Gradient", category: "Accessories", stock: 3, price: 39.99, producer: "Philips" },
  { id: 6, title: "Logitech MX Master 3", category: "Accessories", stock: 42, price: 59.49, producer: "Logitech" },
  { id: 7, title: "Rode Podcast Microphone", category: "Audio", stock: 9, price: 119.49, producer: "Rode" },
  { id: 8, title: "Toshiba Split AC 2 Ton", category: "Appliances", stock: 0, price: 899.99, producer: "Toshiba" },
  { id: 9, title: "Sony Bravia KDL-47W805A", category: "Electronics", stock: 7, price: 970.49, producer: "Sony" },
  { id: 10, title: "Acer Laptop 16 KL-4804", category: "Computers", stock: 13, price: 599.99, producer: "Acer" },
];

type InventoryForm = {
  title: string;
  category: string;
  stock: string;
  price: string;
  producer: string;
};

type FormErrors = Partial<Record<keyof InventoryForm, string>>;

const validate = (form: InventoryForm): FormErrors => {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Product title is required.";
  } else if (form.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  }

  if (!form.category.trim()) {
    errors.category = "Category is required.";
  } else if (!/^[a-zA-Z\s]+$/.test(form.category.trim())) {
    errors.category = "Only alphabets are allowed.";
  }

  if (!form.stock.toString().trim()) {
    errors.stock = "Stock is required.";
  } else if (!/^\d+$/.test(form.stock.toString().trim())) {
    errors.stock = "Stock must be a whole number (0 or more).";
  }

  if (!form.price.toString().trim()) {
    errors.price = "Price is required.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(form.price.toString().trim()) || Number(form.price) <= 0) {
    errors.price = "Price must be a valid positive number.";
  }

  if (!form.producer.trim()) {
    errors.producer = "Producer is required.";
  } else if (!/^[a-zA-Z0-9\s]+$/.test(form.producer.trim())) {
    errors.producer = "Only alphanumeric characters are allowed.";
  }

  return errors;
};

const UpdateStockModal = ({
  item,
  onClose,
  onUpdate,
}: {
  item: any;
  onClose: () => void;
  onUpdate: (data: InventoryForm) => void;
}) => {
  const [form, setForm] = useState<InventoryForm>({
    title: item.title || "",
    category: item.category || "",
    stock: item.stock?.toString() || "",
    price: item.price?.toString() || "",
    producer: item.producer || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof InventoryForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onUpdate(form);
  };

  return (
    <div className="invModalOverlay">
      <div className="invModal">
        <button className="modalClose" onClick={onClose}>✕</button>
        <h2>Update Stock</h2>
        <p className="modalSubtitle">{item.title}</p>

        <div className="formField">
          <label>Product Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Sony PlayStation 5"
          />
          {errors.title && <span className="fieldError">{errors.title}</span>}
        </div>

        <div className="formRow">
          <div className="formField">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Gaming">Gaming</option>
              <option value="Computers">Computers</option>
              <option value="Electronics">Electronics</option>
              <option value="Phones">Phones</option>
              <option value="Accessories">Accessories</option>
              <option value="Audio">Audio</option>
              <option value="Appliances">Appliances</option>
            </select>
            {errors.category && <span className="fieldError">{errors.category}</span>}
          </div>

          <div className="formField">
            <label>Producer</label>
            <input
              type="text"
              name="producer"
              value={form.producer}
              onChange={handleChange}
              placeholder="e.g. Sony"
            />
            {errors.producer && <span className="fieldError">{errors.producer}</span>}
          </div>
        </div>

        <div className="formRow">
          <div className="formField">
            <label>Stock Quantity</label>
            <input
              type="text"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="e.g. 25"
              onKeyPress={(e) => {
                if (!/\d/.test(e.key)) e.preventDefault();
              }}
            />
            {errors.stock && <span className="fieldError">{errors.stock}</span>}
          </div>

          <div className="formField">
            <label>Price ($)</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 299.99"
              onKeyPress={(e) => {
                if (!/[\d.]/.test(e.key)) e.preventDefault();
              }}
            />
            {errors.price && <span className="fieldError">{errors.price}</span>}
          </div>
        </div>

        <div className="modalActions">
          <button className="cancelBtn" onClick={onClose}>Cancel</button>
          <button className="submitBtn" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: inventory = mockInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => mockInventory,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InventoryForm) => data,
    onSuccess: (data) => {
      queryClient.setQueryData(["inventory"], (old: any[] | undefined) =>
        (old || []).map((item) =>
          item.id === selectedItem.id
            ? { ...item, ...data, stock: Number(data.stock), price: Number(data.price) }
            : item
        )
      );
      setUpdateOpen(false);
      setSelectedItem(null);
    },
  });

  const deleteMutation = useMutation({
  mutationFn: async (id: number) => id,
  onSuccess: (id) => {
    queryClient.setQueryData(["inventory"], (old: any[] | undefined) =>
      (old || []).filter((item) => item.id !== id)
    );
  },
});

  const handleUpdateClick = (row: any) => {
    setSelectedItem(row);
    setUpdateOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Product", flex: 2, minWidth: 200 },
    { field: "category", headerName: "Category", width: 140 },
    { field: "producer", headerName: "Producer", width: 130 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      renderCell: (params) => <span>${Number(params.value).toFixed(2)}</span>,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 110,
      renderCell: (params) => {
        const val = Number(params.value);
        return (
          <span className={val < 10 ? "low-stock" : "normal-stock"}>
            {val === 0 ? <>⚠ Out of Stock</> : val < 10 ? <>⚠ {val}</> : val}
          </span>
        );
      },
    },
 {
  field: "action",
  headerName: "Action",
  width: 200,
  renderCell: (params) => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button className="update-btn" onClick={() => handleUpdateClick(params.row)}>
        Update
      </button>
      <button
        onClick={() => deleteMutation.mutate(params.row.id)}
        style={{
          padding: "6px 12px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          minHeight: "44px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
        }}
      >
        Delete
      </button>
    </div>
  ),
},
  ];

  return (
    <div className="inventory">
      <div className="info">
        <h1>Inventory</h1>
        <div className="legend">
          <span className="legend-item low">
            <span className="dot" /> Low Stock (&lt;10)
          </span>
        </div>
      </div>
      <div className="inventoryTable">
        <DataGrid
          className="dataGrid"
          rows={inventory}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          disableColumnFilter
          checkboxSelection          
          disableDensitySelector
          disableColumnSelector
        />
      </div>
      {updateOpen && selectedItem && (
        <UpdateStockModal
          item={selectedItem}
          onClose={() => { setUpdateOpen(false); setSelectedItem(null); }}
          onUpdate={(data) => updateMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Inventory;