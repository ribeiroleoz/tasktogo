import { useEffect, useState } from "react";
import TableProjects from "@/components/app/table/Project"; 
import TaskTable from "@/components/app/table/Task";
import { Card } from "@/components/ui/card";
import { openDatabase, getProjects, deleteProjectById } from "@/db/database";
import { Project } from "@/types/models";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await openDatabase();
        getProjectsData();
      } catch (error) {
        console.error("Erro ao abrir o banco de dados ou buscar projetos", error);
      }
    }
    fetchData();
  }, []);

  async function getProjectsData() {
    const projectData = await getProjects("project");
    setProjects(projectData);
  }

  async function deleteProject(id: string) {
    deleteProjectById(id);
    getProjectsData();
  }

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 p-8">
      <div>
        <Card className="p-5 bg-slate-950 text-slate-50">
          <h4 className="font-semibold">Projetos</h4>
          <TableProjects onInsert={getProjectsData} projects={projects} />
        </Card>
      </div>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id}>
            <Card className="p-5">
              <div className="flex flex-row justify-between">
              <h4  className="font-semibold">{project.name}</h4>
              <Button onClick={() => project.id && deleteProject(project.id)} className="text-red-500 hover:text-red-500" variant="ghost">
                Excluir
              </Button>
              </div>
              <TaskTable projectName={project.name} />
            </Card>
          </div>
        ))
      ) : (
        <div></div>
      )} 
    </div>
  );
}
