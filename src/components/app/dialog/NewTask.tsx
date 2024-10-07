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
import { insertTask } from "@/db/database";
import { Button } from "../../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/models";
import { Textarea } from "../../ui/textarea";

const FormSchema = z.object({
    titulo: z.string(),
    descricao: z.string(),
    urgente: z.boolean().default(false),
    concluida: z.boolean().default(false),
    projeto: z.string(),
});

export default function NewTask({ isOpen, projectName, onEvent }: { isOpen: boolean, projectName: string, onEvent: () => void}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            titulo: "",
            descricao: "",
            urgente: false,
            concluida: false,
            projeto: projectName,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const task: Task = {
            titulo: data.titulo,
            descricao: data.descricao,
            urgente: data.urgente,
            concluida: data.concluida,
            projeto: data.projeto,
        };

        insertTask(task).then(() => {
            form.reset();
            onEvent();
        });
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onEvent}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Adicionar nova tarefa em 
                            <span className="ps-1 text-xl font-bold">
                                {projectName}
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="titulo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="titulo">Título</FormLabel>
                                        <div className="w-full">
                                            <Input id="titulo" {...field} />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="descricao">Descrição</FormLabel>
                                        <div className="w-full">
                                            <Textarea className="resize-none" id="descricao" {...field} />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="urgente"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-1 space-y-0 mt-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id="urgente"
                                        />
                                        <FormLabel htmlFor="urgente">Urgente</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="concluida"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-1 space-y-0 mt-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id="concluida"
                                        />
                                        <FormLabel htmlFor="concluida">Concluído</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full mt-6" type="submit">Salvar</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
