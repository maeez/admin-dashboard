import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUser } from "../../services/productService";
import Single from "../../components/single/Single";
import Update from "../../components/update/Update";
import { singleUser } from "../../data";
import { GridColDef } from "@mui/x-data-grid";
import "./user.scss";

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First name", type: "string" },
  { field: "lastName", headerName: "Last name", type: "string" },
  { field: "email", headerName: "Email", type: "string" },
  { field: "phone", headerName: "Phone", type: "string" },
  { field: "verified", headerName: "Verified", type: "boolean" },
];

const User = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userId = Number(id);

  const { data: rawUser, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(userId),
    enabled: !!id,
    initialData: () => {
      return queryClient
        .getQueryData<any[]>(["users"])
        ?.find((u) => u.id === userId);
    },
  });
  const mutation = useMutation({
    mutationFn: async (updatedData: any) => updatedData,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", id], (old: any) => ({
        ...old,
        ...data,
      }));

      queryClient.setQueryData(["users"], (old: any[] = []) => {
        return old.map((user) => 
          user.id === Number(id) ? { ...user, ...data } : user
        );
      });
    },
  });

  if (isLoading) return <div className="user">Loading...</div>;
  if (!rawUser) return <div className="user">User not found.</div>;

  const fullName = `${rawUser.firstName} ${rawUser.lastName}`;

  const formattedUser = {
    ...rawUser,
    img: rawUser.image || "/noavatar.png",
    title: fullName,
    info: {
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      email: rawUser.email,
      phone: rawUser.phone,
    },
    chart: singleUser.chart,
    activities: singleUser.activities.map((activity) => ({
      ...activity,
      text: activity.text.replace("John Doe", fullName),
    })),
  };

  return (
    <div className="user">
      <Single {...formattedUser} onUpdate={() => setOpen(true)} />
      {open && (
        <Update
          slug="user"
          columns={columns}
          setOpen={setOpen}
          data={formattedUser}
          onUpdate={(data) => mutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default User;