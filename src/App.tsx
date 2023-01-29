import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import Auth from './Auth';
import { supabase } from './supabaseClient';
import Tasks from './Tasks';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className='h-screen w-6/12 mx-auto flex flex-col align-middle justify-center'>
      {!session ? <Auth /> : <Tasks session={session} />}
    </div>
  );
}

export default App;
