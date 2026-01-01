import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/character'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user has an astro profile
      const { data: { user } } = await supabase.auth.getUser();
      console.log("[Auth Callback] User:", user?.id);
      
      if (user) {
         const { data: profile, error: profileError } = await supabase
            .from('astro_profiles')
            .select('user_id')
            .eq('user_id', user.id)
            .single();
         
         if (profileError && profileError.code !== 'PGRST116') {
             console.error("[Auth Callback] Profile Fetch Error:", profileError);
         }

         if (profile) {
             console.log("[Auth Callback] Profile found, redirecting to /character");
             return NextResponse.redirect(`${origin}/character`);
         } else {
             console.log("[Auth Callback] No profile, redirecting to /onboarding/astro");
             return NextResponse.redirect(`${origin}/onboarding/astro`);
         }
      }
      
      // Fallback if no user found (shouldn't happen on success)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
        console.error("[Auth Callback] Code Exchange Error:", error);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
