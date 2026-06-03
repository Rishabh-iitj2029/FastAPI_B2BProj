import { useState, useTransition } from 'react'
import { useOrganization } from '@clerk/clerk-react'
import TaskColumn from './TaskColumn'
import { createTasks, updateTasks, deleteTasks } from '../services/api'

const STATUS = ["pending", "starting", "completed"]

const KanbanBoard = () => {
  const { memebership } = useOrganization();
  const {showForm, setShowForm} = useState(false)
  const [editingtask, seteditingtask] = useState(null)

  const role = memebership?.role
  const canManage = role === "org:admin" || role === "org:editor"
  function getTaskStatus(status){
    return tasks.filter(task => task.status === status)
  }

  function handleEdit(task){
    seteditingtask(task);
    setShowForm(true)
  }

  async function handleDelete(taskId){
    if(!confirm("Are you sure you want to delete the task")) return

    const taskToDelete = task.find(t => t.id === taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))

    try{
      await deleteTasks(getToken, taskId)
    }catch(err){
      setTasks(prev => [...prev, taskToDelete])
      console.log(err)
    }
  }

  async function hnadleSubmit(taskData){
    if(editingtask){
      const updatedTask = {...editingtask,...taskData}
      setTasks(prev => prev.map(t => t.id === editingtask.id ? updatedTask :t))
      setShowForm(false)
      seteditingtask(null)

      try {
        await updateTasks(getToken, editingtask.id,taskData)
      } catch (error) {
          setTasks(prev => prev.map(t => t.id === editingtask.id ? editingtask : t)) 

      }
    }
    else{
      try {
        const newTask = await createTasks(getToken, taskData)
        setTasks(prev => [...prev, newTask])
        setShowForm(false)
      } catch (error) {
        console.log(error);
        
      }
    }
  }


  function handleCancel(){
    setShowForm(false)
    seteditingtask(null)
  }

  function handleAddTask(){
    setShowForm(true)
    seteditingtask(null)
  }



  return (
    <div className={"kanban-wrapper"}>
        <div className={"kanban-header"}>
            <h2 className={"kanban-title"}>Tasks</h2>
            {canManage && (
                <button className={"btn btn-primary"} onClick={handleAddTask}>
                    + Add Task
                </button>
            )}
        </div>

        <div className={"kanban-board"}>
            {STATUS.map(status => (
                <TaskColumn
                    key={status}
                    status={status}
                    tasks={getTaskStatus(status)}
                    onEdit={canManage ? handleEdit : null}
                    onDelete={canManage ? handleDelete : null}
                />
            ))}
        </div>

        {showForm && <TaskForm
            task={editingtask}
            onSubmit={hnadleSubmit}
            onCancel={handleCancel}
        />}
    </div>
  )
}

export default KanbanBoard
