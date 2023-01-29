import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Tasks(props: { session: Session }) {
  const { session } = props
  type Tasks = Awaited<ReturnType<typeof getTasks>>

  const [tasks, setTasks] = useState<Tasks>()
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState<string>('')

  useEffect(() => {
    showTasks()
  }, [session])

  const getTasks = async () => {
    const {data, error} = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('inserted_at', {ascending: true})

    if (error) {
      console.log(error)
    }

    return data
  }

  const showTasks = async () => {
    setLoading(true)

    const tasks = await getTasks()

    setTasks(tasks)

    setLoading(false)
  }

  const createTask = async (task: string) => {
    const {data, error} = await supabase
      .from('todos')
      .insert({user_id: session.user.id, task, is_complete: false, inserted_at: new Date().toISOString()})

    if (error) {
      console.log(error)
    }

    return data
  }

  const toggleCompleteTask = async (id: number) => {
    const d = await supabase
      .from('todos')
      .select('is_complete')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    const {data, error} = await supabase
      .from('todos')
      .update({is_complete: !d.data?.is_complete})
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.log(error)
    }

  }


  const deleteTask = async (id: number) => {
    const {data, error} = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)
    
    if (error) {
      console.log(error)
    }
  }



  return (
    <>
      <h1 className="mx-auto font-bold text-5xl">Tasks</h1>

      <div className="flex flex-col mx-auto w-7/12 justify-center content-center">
        {loading ? 
          <div className="bg-gray-100 shadow-lg rounded-full text-center p-2">...</div> :
          tasks && tasks.map((task) => (
            <div className={`${task.is_complete ? "bg-green-100" : "bg-gray-100"} shadow-lg rounded-full p-2 flex flex-row items-center justify-start mt-5`} key={task.id} onClick={async () => {await toggleCompleteTask(task.id); await showTasks()}}>
              <button className="p-2 bg-gray-300 rounded-full mx-5" onClick={async () => {await deleteTask(task.id); await showTasks()}}>X</button>
              <p>{task.task}</p>
            </div>
          ))
        }
      </div>

      <div className="p-5 w-7/12 mx-auto bg-gray-100 rounded-lg shadow-lg mt-5 text-center">
        <h1 className="mx-auto font-bold text-5xl">Create Task</h1>
        <div className="grid grid-cols-3 gap-1 mx-auto mt-4">
          <input 
            type="text" 
            className="col-span-2 bg-gray-200 rounded-full pl-4 pr-4 border-none outline-none transition-all focus:shadow-md focus: p-2" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
          />
          <button className="col-span-1 rounded-full bg-gray-200 active:scale-95 transition-all"  onClick={async () => {
            if (newTask) {
              await createTask(newTask)
            }
            await showTasks()
            setNewTask('')
          }}>Create</button>
        </div>
      </div>

      <button className="mx-auto mt-5 p-4 bg-gray-200 rounded-full active:scale-95 transition-all" onClick={async () => {
        await supabase.auth.signOut()
      }}>Sign Out</button>
    </>
  )
}
