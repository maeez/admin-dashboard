import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./orders.scss";

const statusColors: Record<string, string> = {
  Delivered: "#22c55e",
  Pending: "#eab308",
  Cancelled: "#ef4444",
  Processing: "#3b82f6",
};

const mockOrders = [
  { id: 1, customerName: "Elva McDonald", date: "2024-01-15", amount: 250.99, status: "Delivered" },
  { id: 2, customerName: "Linnie Nelson", date: "2024-01-16", amount: 499.99, status: "Pending" },
  { id: 3, customerName: "Brent Reeves", date: "2024-01-17", amount: 999.49, status: "Processing" },
  { id: 4, customerName: "Adeline Watson", date: "2024-01-18", amount: 799.49, status: "Delivered" },
  { id: 5, customerName: "Juan Harrington", date: "2024-01-19", amount: 39.99, status: "Cancelled" },
  { id: 6, customerName: "Augusta McGee", date: "2024-01-20", amount: 59.49, status: "Delivered" },
  { id: 7, customerName: "Angel Thomas", date: "2024-01-21", amount: 119.49, status: "Pending" },
  { id: 8, customerName: "Garrett Dean", date: "2024-01-22", amount: 899.99, status: "Processing" },
  { id: 9, customerName: "Leah Parsons", date: "2024-01-23", amount: 970.49, status: "Delivered" },
  { id: 10, customerName: "Elnora Reid", date: "2024-01-24", amount: 599.99, status: "Pending" },
];

type OrderForm = {
  customerName: string;
  date: string;
  amount: string;
  status: string;
};

type FormErrors = Partial<Record<keyof OrderForm, string>>;

const emptyForm: OrderForm = { customerName: "", date: "", amount: "", status: "" };

const validate = (form: OrderForm): FormErrors => {
  const errors: FormErrors = {};

  if (!form.customerName.trim()) {
    errors.customerName = "Customer name is required.";
  } else if (!/^[a-zA-Z\s]+$/.test(form.customerName.trim())) {
    errors.customerName = "Only alphabets and spaces are allowed.";
  }

  if (!form.date) {
    errors.date = "Date is required.";
  }

  if (!form.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
    errors.amount = "Amount must be a valid positive number.";
  }

  if (!form.status) {
    errors.status = "Please select a status.";
  }

  return errors;
};

const AddOrderModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: OrderForm) => void;
}) => {
  const [form, setForm] = useState<OrderForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd(form);
  };

  return (
    <div className="orderModalOverlay">
      <div className="orderModal">
        <button className="modalClose" onClick={onClose}>✕</button>
        <h2>Add New Order</h2>

        <div className="formField">
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="e.g. John Smith"
            onKeyPress={(e) => {
              if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
            }}
          />
          {errors.customerName && <span className="fieldError">{errors.customerName}</span>}
        </div>

        <div className="formField">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.date && <span className="fieldError">{errors.date}</span>}
        </div>

        <div className="formField">
          <label>Amount ($)</label>
          <input
            type="text"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 199.99"
            onKeyPress={(e) => {
              if (!/[\d.]/.test(e.key)) e.preventDefault();
            }}
          />
          {errors.amount && <span className="fieldError">{errors.amount}</span>}
        </div>

        <div className="formField">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">-- Select Status --</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {errors.status && <span className="fieldError">{errors.status}</span>}
        </div>

        <div className="modalActions">
          <button className="cancelBtn" onClick={onClose}>Cancel</button>
          <button className="submitBtn" onClick={handleSubmit}>Add Order</button>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders = mockOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => mockOrders,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: async (newOrder: OrderForm) => {
      const current = queryClient.getQueryData<any[]>(["orders"]) || [];
      const nextId = current.length > 0 ? Math.max(...current.map((o) => Number(o.id))) + 1 : 1;
      return { ...newOrder, id: nextId, amount: Number(newOrder.amount) };
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["orders"], (old: any[] | undefined) => [newData, ...(old || [])]);
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(["orders"], (old: any[] | undefined) =>
        (old || []).filter((o) => Number(o.id) !== Number(id))
      );
    },
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "customerName", headerName: "Customer Name", flex: 1, minWidth: 160 },
    { field: "date", headerName: "Date", width: 130 },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      renderCell: (params) => <span>${Number(params.value).toFixed(2)}</span>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => (
        <span
          className="status-badge"
          style={{
            backgroundColor: (statusColors[params.value] || "#888") + "22",
            color: statusColors[params.value] || "#888",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div
          className="delete-action"
          onClick={() => deleteMutation.mutate(Number(params.row.id))}
        >
          <img src="/delete.svg" alt="delete" />
        </div>
      ),
    },
  ];

  return (
    <div className="orders">
      <div className="info">
        <h1>Orders</h1>
        <button onClick={() => setOpen(true)}>+ Add New Order</button>
      </div>

      <div className="ordersTable">
        <DataGrid
          className="dataGrid"
          rows={orders}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
        />
      </div>

      {open && (
        <AddOrderModal
          onClose={() => setOpen(false)}
          onAdd={(data) => addMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Orders;