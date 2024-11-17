import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link
        className={"w-20 h-20 border rounded-lg p-10 bg-blue-300"}
        href="/management/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className={"w-20 h-20 border rounded-lg p-10 bg-red-300"}
        href="/login"
      >
        Login
      </Link>
    </div>
  );
}
