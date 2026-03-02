import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../services/productService";

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
  { field: "phone", headerName: "Phone", width: 200 },
  { field: "verified", headerName: "Verified", width: 150, type: "boolean" },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn:getUsers,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addUserMutation = useMutation({
    mutationFn: async (newUser: any) => newUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: any[] = []) => [
        ...old,
        {
          id: old.length ? Math.max(...old.map(u => u.id)) + 1 : 1,
          img: "",
          ...newUser,
        },
      ]);

      return { previousUsers };
    },
    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => id,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: any[] = []) =>
        old.filter((user) => user.id !== id)
      );

      return { previousUsers };
    },
    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });

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
        onDelete={(id) => deleteUserMutation.mutate(id)}
      />

      {open && (
        <Add
          slug="user"
          columns={columns}
          setOpen={setOpen}
          onAdd={(data) => {
            addUserMutation.mutate(data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Users;