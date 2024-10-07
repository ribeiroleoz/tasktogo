import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@/types/models";
import NewProject from "../dialog/NewProject";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function TableProjects({ projects, onInsert }: { projects: Project[], onInsert: () => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function projectAdded() {
        setIsDialogOpen(false);
        onInsert();
    }

  return (
      <div className="max-h-96 overflow-y-auto">
        <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(true)} className="mt-5 px-8 bg-slate-50 text-slate-900 hover:bg-slate-200">
                Novo Projeto
                <FaPlus className="ml-2"/>
            </Button>
            <NewProject 
             onEvent={projectAdded} 
             isOpen={isDialogOpen}
             >
            </NewProject>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-slate-300">Nome</TableHead>
                    <TableHead className="text-slate-300">Pendentes</TableHead>
                    <TableHead className="text-slate-300">Concluídas</TableHead>
                    <TableHead className="text-slate-300">Urgentes</TableHead>
                    <TableHead className="text-slate-300">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((project, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            {project.name}
                        </TableCell>
                        <TableCell>{project.pendentes}</TableCell>
                        <TableCell>{project.concluidas}</TableCell>
                        <TableCell>{project.urgentes}</TableCell>
                        <TableCell>{project.total}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
  );
}