import RentView from "@/src/views/rent";


async function Rent() {
  const users = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-300 to-blue-900">
      <div className="container pt-12">
        <RentView users={users} />
      </div>
    </div>
  );
}

export default Rent;
