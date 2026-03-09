import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import "./update.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  onUpdate: (data: any) => void;
};

const Update = (props: Props) => {
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    if (props.slug === "product") {
      if (data.price && Number(data.price) <= 0) {
        setError("Price must be greater than 0.");
        return;
      }
      if (data.stock && Number(data.stock) < 0) {
        setError("Stock cannot be negative.");
        return;
      }
    }

    if (props.slug === "user") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (data.email && !emailRegex.test(data.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (data.phone && data.phone.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }
    }

    props.columns.forEach((col) => {
      if (col.type === "boolean") {
        data[col.field] = formData.get(col.field) === "on";
      }
    });

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    props.onUpdate(filteredData);
    props.setOpen(false);
  };

  return (
    <div className="update">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>X</span>
        <h1>Update {props.slug}</h1>
        {error && <p className="error-msg" style={{ color: "tomato", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className={`item ${column.type === "boolean" ? "checkbox-item" : ""}`} key={column.field}>
                <label>{column.headerName}</label>
                {column.type === "boolean" ? (
                  <input
                    type="checkbox"
                    name={column.field}
                    defaultChecked={props.data.info?.[column.field] || props.data[column.field]}
                  />
                ) : (
                  <input
                    type={column.type === "number" ? "number" : "text"}
                    name={column.field}
                    defaultValue={props.data.info?.[column.field] || props.data[column.field]}
                    onKeyPress={(e) => {
                      if (column.field === "phone" && !/[0-9]/.test(e.key)) e.preventDefault();
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

export default Update;