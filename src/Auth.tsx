import { supabase } from './supabaseClient'
import { Auth as SupaAuth, ThemeSupa } from '@supabase/auth-ui-react'

export default function Auth() {
  return (
    <SupaAuth 
      supabaseClient={supabase}  // Will authenticate the supabase session.
      appearance={{theme: ThemeSupa}}
      providers={['google']}
    />
  )
}
