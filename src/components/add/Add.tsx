import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useState } from "react";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd?: (data: Record<string, unknown>) => void;
};

const Add = (props: Props) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (props.onAdd) {
      props.onAdd(formData);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.type === "boolean" ? (
                  <select
                    value={formData[column.field] === true ? "true" : "false"}
                    onChange={(e) => handleInputChange(column.field, e.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                ) : (
                  <input
                    type={column.type || "text"}
                    placeholder={column.field as string}
                    onChange={(e) => handleInputChange(column.field, e.target.value)}
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
