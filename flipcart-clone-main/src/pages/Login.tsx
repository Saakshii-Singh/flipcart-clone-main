import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ identifier, password });
      toast({ title: 'Welcome back!' });
      navigate(redirectTo);
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Login failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2874f0] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-[750px] flex overflow-hidden min-h-[480px]">
        {/* Left Blue Panel */}
        <div className="hidden md:flex flex-col justify-between w-[40%] bg-[#2874f0] p-8 text-white">
          <div>
            <h2 className="text-[28px] font-bold leading-tight">Login</h2>
            <p className="text-base text-white/80 mt-3 leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img
            src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/login_img-c461b9.png"
            alt=""
            className="w-full max-w-[200px] mx-auto mt-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs text-[#878787] font-medium">Enter Email/Username</label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-11 text-[15px] shadow-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#878787] font-medium">Enter Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-11 text-[15px] shadow-none"
              />
            </div>
            <p className="text-[11px] text-[#878787] leading-relaxed">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#f05a10] text-white font-bold py-3 h-12 rounded-sm text-[15px]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center">
              <span className="text-xs text-[#7f7f7f]">OR</span>
            </div>
            <button type="button" className="w-full text-[#2874f0] font-bold text-sm py-2 rounded-sm hover:bg-[#f5f8ff] transition-colors">
              Request OTP
            </button>
          </form>
          <p className="text-center text-sm mt-6">
            <span className="text-[#878787]">New to Flipkart? </span>
            <Link to="/signup" className="text-[#2874f0] font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
