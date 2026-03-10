import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../services/queryService";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 200, hideable: true },
  { field: "verified", headerName: "Verified", width: 150, type: "boolean", hideable: true },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      const currentUsers = queryClient.getQueryData<any[]>(["users"]) || [];
      const nextId = currentUsers.length > 0 
        ? Math.max(...currentUsers.map(u => Number(u.id))) + 1 
        : 31;

      return {
        ...newUser,
        id: nextId,
        img: newUser.img || "/noavatar.png",
        verified: newUser.verified || false,
      };
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["users"], (old: any[] | undefined) => {
        return [newData, ...(old || [])];
      });
      setOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return id;
    },
    onSuccess: (variables) => {
      queryClient.setQueryData(["users"], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter((item) => Number(item.id) !== Number(variables));
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      <DataTable
        slug="users"
        columns={columns}
        rows={users}
        onDelete={(id) => deleteUserMutation.mutate(Number(id))}
      />

      {open && (
        <Add
          slug="user"
          columns={columns}
          setOpen={setOpen}
          onAdd={(data) => addUserMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Users;