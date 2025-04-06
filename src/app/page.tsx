import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to Air Quality App</h1>
      <ThemeToggle />
    </div>
  );
}
