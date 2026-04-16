import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signUp({ firstname, lastname, username, email, password, phone });
      toast({ title: 'Account created! Welcome to Flipkart!' });
      navigate(redirectTo);
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Signup failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2874f0] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-[750px] flex overflow-hidden min-h-[520px]">
        {/* Left Blue Panel */}
        <div className="hidden md:flex flex-col justify-between w-[40%] bg-[#2874f0] p-8 text-white">
          <div>
            <h2 className="text-[28px] font-bold leading-tight">Looks like you're new here!</h2>
            <p className="text-base text-white/80 mt-3 leading-relaxed">
              Sign up with your details to get started
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#878787] font-medium">First Name</label>
                <Input value={firstname} onChange={e => setFirstname(e.target.value)} required className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
              </div>
              <div>
                <label className="text-xs text-[#878787] font-medium">Last Name</label>
                <Input value={lastname} onChange={e => setLastname(e.target.value)} required className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#878787] font-medium">Username</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
            </div>
            <div>
              <label className="text-xs text-[#878787] font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
            </div>
            <div>
              <label className="text-xs text-[#878787] font-medium">Phone (optional)</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
            </div>
            <div>
              <label className="text-xs text-[#878787] font-medium">Password (min 6 chars)</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-none border-0 border-b-2 border-[#e0e0e0] focus:border-[#2874f0] px-0 h-10 shadow-none" />
            </div>
            <p className="text-[11px] text-[#878787]">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>
            <Button type="submit" disabled={loading} className="w-full bg-[#fb641b] hover:bg-[#f05a10] text-white font-bold py-3 h-12 rounded-sm text-[15px]">
              {loading ? 'Creating account...' : 'CONTINUE'}
            </Button>
          </form>
          <p className="text-center text-sm mt-6">
            <span className="text-[#878787]">Already have an account? </span>
            <Link to="/login" className="text-[#2874f0] font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
