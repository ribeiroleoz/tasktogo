import { Project, Task } from "@/types/models";

const indexedDB = window.indexedDB;
let db: IDBDatabase | null = null;

// Função para abrir o banco de dados
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskDB", 1);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;

      if (target) {
        db = target.result;
      } else {
        reject("Erro ao abrir o banco de dados");
        return;
      }

      console.log("Banco de dados aberto: ", db);
      if (!db) {
        console.error("Banco de dados não existe");
        reject("Banco de dados não existe");
        return;
      }

      db.createObjectStore("task", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("project", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onerror = (event) => {
      reject(event);
    };
  });
};

export const insert = async (table: string, data: Task | Project) => {
  if (!db) {
    await openDatabase();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([table], "readwrite");
    const store = transaction.objectStore(table);
    const request = store.add(data);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      alert("Erro ao inserir dados");
      reject("Erro ao inserir dados");
    };
  });
};

export async function getProjects(table: string): Promise<Project[]> {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([table], "readonly");
    const store = transaction.objectStore(table);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      alert("Erro ao buscar dados");
      reject("Erro ao buscar dados");
    };
  });
};

export async function getTasksByProject(projectName: string): Promise<Task[]> {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["task"], "readonly");
    const taskStore = transaction.objectStore("task");
    const request = taskStore.getAll();

    request.onsuccess = () => {
      const allTasks = request.result as Task[];

      const tasks = allTasks.filter(task => task.projeto === projectName);

      resolve(tasks);
    };

    request.onerror = () => {
      reject("Erro ao buscar tarefas");
    };
  });
}

export async function deleteProjectById(projectId: string) {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["project"], "readwrite");
    const store = transaction.objectStore("project");
    const request = store.delete(projectId);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject("Erro ao deletar projeto");
    };
  });
}

export async function updateTask(task: Task) {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["task"], "readwrite");
    const store = transaction.objectStore("task");
    const request = store.put(task);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject("Erro ao atualizar tarefa");
    };
  });
}

export async function deleteTaskById(taskId: string) {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["task"], "readwrite");
    const store = transaction.objectStore("task");
    const request = store.delete(taskId);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject("Erro ao deletar tarefa");
    };
  });
}

export async function insertTask(task: Task) {
  if (!db) {
    await openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(["task"], "readwrite");
    const store = transaction.objectStore("task");
    let request;
    
    if(task.id !== undefined) {
      request = store.put(task);
    } else {
      request = store.add(task);
    }

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject("Erro ao inserir tarefa");
    };
  });
}

