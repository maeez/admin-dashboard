import { GridColDef } from "@mui/x-data-grid";
import "./update.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  onUpdate: (data: any) => void;
};

const Update = (props: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

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
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Update {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.type === "boolean" ? (
                  <input
                    type="checkbox"
                    name={column.field}
                    defaultChecked={props.data.info[column.field] || props.data[column.field]}
                  />
                ) : (
                  <input
                    type={column.type || "text"}
                    name={column.field}
                    defaultValue={props.data.info[column.field] || props.data[column.field]}
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