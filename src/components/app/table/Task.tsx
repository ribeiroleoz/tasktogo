import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Task } from "@/types/models";
import { useEffect, useState } from "react";
import { deleteTaskById, getTasksByProject, openDatabase } from "@/db/database";
import { FaChevronDown, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import NewTask from "../dialog/NewTask";
import { Button } from "@/components/ui/button";
import EditTask from "../dialog/EditTask";

export default function TaskTable({ projectName }: { projectName: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [indexesToShow, setIndexes] = useState<boolean[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [tasktoEdit, setTaskToEdit] = useState<Task>();

    useEffect(() => {
        openDatabase().then(() => {
            getTasks(projectName);
        });
    }, [projectName]);

    async function getTasks(projectName: string) {
        const taskData: Task[] = await getTasksByProject(projectName);
        setIndexes(new Array(taskData.length).fill(false));
        setTasks(taskData);
    }

    async function reload(){
        await getTasks(projectName);
    }

    function showDescription(index: number) {
        const updatedIndexes = [...indexesToShow];
        updatedIndexes[index] = !updatedIndexes[index];
        setIndexes(updatedIndexes);
    }

    function deleteTask(id: string){
        deleteTaskById(id).then(() => {
            reload();
        });
    }

    function openEditDialog(task: Task) {
        setTaskToEdit(task);
        setEditDialogOpen(true);
    }

    function taskAdded() {
        reload();
        setIsDialogOpen(false);
    }

    function taskEdited(){
        reload();
        setEditDialogOpen(false);
        setTaskToEdit(undefined);
    }

    return (
        <div className="h-96 overflow-y-auto">
            <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(true)} className="mt-5 px-8">
                    Nova Tarefa
                    <FaPlus className="ml-2"/>
                </Button>
                <NewTask 
                    projectName={projectName} 
                    onEvent={taskAdded} 
                    isOpen={isDialogOpen}
                />
            </div>
            <Table className="text-left">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Urgência</TableHead>
                        <TableHead>Concluída</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task, index) => {
                        return (
                            <React.Fragment key={task.id}>
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{task.id}</TableCell>
                                    <TableCell className="w-48">{task.titulo}</TableCell>
                                    <TableCell>{task.urgente ? "🔥" : "🏖️"}</TableCell>
                                    <TableCell>{task.concluida ? "✔️" : "❌"}</TableCell>
                                    <TableCell className="justify-end flex flex-row gap-x-3">
                                        <Button variant="ghost" onClick={() => showDescription(index)}>
                                            <FaChevronDown/>
                                        </Button>
                                        <Button onClick={() => openEditDialog(task)}  variant="outline">
                                            <FaPencilAlt className="text-slate"/>
                                        </Button>
                                        <Button onClick={() => task.id && deleteTask(task.id)} variant="outline">
                                            <FaTrash className="text-red-600"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {indexesToShow[index] && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="bg-gray-100">
                                            <div className="p-2">
                                                {task.descricao}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            { tasktoEdit && <EditTask task={tasktoEdit} isOpen={isEditDialogOpen} onEvent={taskEdited}></EditTask> }
        </div>
    );
}
