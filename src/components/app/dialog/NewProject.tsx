import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { insert } from "@/db/database";
import { Project } from "@/types/models";
import { Button } from "../../ui/button";


const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Nome do projeto deve ter pelo menos 2 letras",
    }),
  });

export default function NewProject({ onEvent, isOpen }: { onEvent: () => void, isOpen: boolean }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        name: "",
    },
});

function onSubmit(data: z.infer<typeof FormSchema>) {
    
   const project: Project = {
      name: data.name,
      pendentes: 0,
      concluidas: 0,
      urgentes: 0,
      total: 0,
  }

    insert("project", project).then(() => onEvent());
}
    return (
        <div>
        <Dialog open={isOpen} onOpenChange={onEvent}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Adicionar um novo Projeto</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                          <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel htmlFor="name">Nome do Projeto</FormLabel>
                                      <div className="w-full">
                                          <Input id="name" {...field} />
                                      </div>
                                  </FormItem>
                              )}
                          />
                          <Button className="w-full mt-6" type="submit">Salvar</Button>
                      </form>
                  </Form>
              </DialogContent>
          </Dialog>
        </div>
    )
}