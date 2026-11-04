import type { Task } from "./types";

/**
 * No database: the list lives in this process.
 * globalThis keeps the same array across Next.js hot reloads in dev.
 * A restart loads the sample tasks again. That is intentional.
 */
type Memory = {
  tasks: Task[];
  nextId: number;
};

const globalForTasks = globalThis as unknown as {
  __taskMemory?: Memory;
};

const SAMPLE: Array<Pick<Task, "titulo" | "descricao">> = [
  {
    titulo: "Review the short film script for Tide",
    descricao: "Read the third act and mark the cuts the studio suggested.",
  },
  {
    titulo: "Pull color references for the Lume campaign",
    descricao: "Three palettes. No photos of real people.",
  },
  { titulo: "Confirm the paper delivery for the sketchbook" },
  {
    titulo: "Update the quarter deadline sheet",
    descricao: "Fictional projects on the internal board only.",
  },
  { titulo: "Write captions for the studio photo series" },
  {
    titulo: "Draft the site publish checklist",
    descricao: "Home, work, and the contact page. No live form.",
  },
  { titulo: "Review the North client's contract" },
  { titulo: "Sort the files from Tuesday's session" },
  {
    titulo: "Prepare this week's board",
    descricao: "Move finished work into the archive.",
  },
  { titulo: "Check the poster print proofs" },
  { titulo: "Write up notes from Monday's meeting" },
  {
    titulo: "Pick a title for the November newsletter",
    descricao: "Internal draft. Do not send it.",
  },
  { titulo: "Archive the old logo versions" },
  { titulo: "List materials for Saturday's workshop" },
];

function seedMemory(): Memory {
  const now = Date.now();
  const tasks = SAMPLE.map((item, index) => {
    const task: Task = {
      id: String(index + 1),
      titulo: item.titulo,
      dataCriacao: now - (SAMPLE.length - index) * 60 * 60 * 1000,
    };
    if (item.descricao) {
      task.descricao = item.descricao;
    }
    return task;
  });

  return { tasks, nextId: tasks.length + 1 };
}

function memory(): Memory {
  if (!globalForTasks.__taskMemory) {
    globalForTasks.__taskMemory = seedMemory();
  }
  return globalForTasks.__taskMemory;
}

function copy(task: Task): Task {
  return { ...task };
}

export class InvalidCursorError extends Error {
  constructor() {
    super("INVALID_CURSOR");
    this.name = "InvalidCursorError";
  }
}

function byNewest(a: Task, b: Task) {
  return b.dataCriacao - a.dataCriacao || Number(b.id) - Number(a.id);
}

export function listTasks(limit: number, cursor?: string | null) {
  const sorted = [...memory().tasks].sort(byNewest);
  let start = 0;

  if (cursor) {
    const index = sorted.findIndex((task) => task.id === cursor);
    if (index === -1) {
      throw new InvalidCursorError();
    }
    start = index + 1;
  }

  const window = sorted.slice(start, start + limit + 1);
  const items = window.slice(0, limit).map(copy);
  const nextCursor = window.length > limit ? (items.at(-1)?.id ?? null) : null;

  return { items, nextCursor };
}

export function getTask(id: string) {
  const task = memory().tasks.find((item) => item.id === id);
  return task ? copy(task) : null;
}

export function createTask(input: { titulo: string; descricao?: string }) {
  const state = memory();
  const task: Task = {
    id: String(state.nextId),
    titulo: input.titulo.trim(),
    dataCriacao: Date.now(),
  };
  state.nextId += 1;

  const descricao = input.descricao?.trim();
  if (descricao) {
    task.descricao = descricao;
  }

  state.tasks.push(task);
  return copy(task);
}

export function updateTask(input: {
  id: string;
  titulo: string;
  descricao?: string;
}) {
  const task = memory().tasks.find((item) => item.id === input.id);
  if (!task) {
    return null;
  }

  task.titulo = input.titulo.trim();
  const descricao = input.descricao?.trim();
  if (descricao) {
    task.descricao = descricao;
  } else {
    delete task.descricao;
  }

  return copy(task);
}

export function deleteTask(id: string) {
  const state = memory();
  const index = state.tasks.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = state.tasks.splice(index, 1);
  return removed ? copy(removed) : null;
}
