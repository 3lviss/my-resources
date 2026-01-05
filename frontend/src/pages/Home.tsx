import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="max-w-2xl text-center relative z-10">
        <h1 className="text-5xl sm:text-7xl font-thin mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          MyResources
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl mb-12 leading-relaxed">
          Organize and manage your learning resources in one place. Save tools, libraries,
          tutorials, articles, and videos with descriptions and use cases so you can easily
          find them when you need them.
        </p>

        {!loading && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button href="/resources" variant="gradient" size="lg">
                My Resources
              </Button>
            ) : (
              <>
                <Button href="/login" variant="gradient" size="lg">
                  Login
                </Button>
                <Button href="/register" variant="glass" size="lg">
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
