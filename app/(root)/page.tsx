import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-300 to-blue-900">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          Uçak Bileti Satın Al
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10">
          Hemen uçak bileti satın al ve seyahat etmeye başla.
        </p>
        <Link
          href="/rent"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Bilet Satın Al
        </Link>
      </div>
    </div>
  );
}
