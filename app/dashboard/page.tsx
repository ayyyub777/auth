import { auth } from "@/auth";

const DashboardPage = async () => {
  const { user } = (await auth()) || {};
  return <h1>{JSON.stringify(user)}</h1>;
};

export default DashboardPage;
