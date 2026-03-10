import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import "./add.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd: (data: any) => void;
};

const Add = (props: Props) => {
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    if (props.slug === "product") {
      if (!data.price || isNaN(Number(data.price)) || Number(data.price) <= 0) {
        setError("Price must be a valid number greater than 0.");
        return;
      }
      if (!data.stock || isNaN(Number(data.stock)) || Number(data.stock) < 0) {
        setError("Stock must be a valid number (0 or more).");
        return;
      }
    }

    if (props.slug === "user") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     
      if (!data.firstName || data.firstName.trim() === "") {
    setError("First name is required.");
    return;
  }

     if (!data.lastName || data.lastName.trim() === "") {
    setError("Last name is required.");
    return;
  }

      if (!data.email && !emailRegex.test(data.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!data.phone || data.phone.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }
    }

    props.columns.forEach((col) => {
      if (col.type === "boolean") {
        data[col.field] = formData.get(col.field) === "on";
      }
    });

    props.onAdd(data);
    props.setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>X</span>
        <h1>Add new {props.slug}</h1>
        {error && <p className="error-msg" style={{ color: "tomato", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className={`item ${column.type === "boolean" ? "checkbox-item" : ""}`} key={column.field}>
                <label>{column.headerName}</label>
                {column.type === "boolean" ? (
                  <input type="checkbox" name={column.field} />
                ) : (
                  <input
                    type="text"
                    name={column.field}
                    placeholder={column.headerName}
                    maxLength={column.field === "phone" ? 10 : undefined}
                    onKeyPress={(e) => {
                      const isNumericField = ["price", "stock", "phone"].includes(column.field);
                      if (isNumericField && !/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              </div>
            ))}
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;